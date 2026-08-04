import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const msg = (exceptionResponse as any).message;
        message = Array.isArray(msg) ? msg.join(', ') : msg;
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
      // Clean up common Prisma error messages
      if ('code' in exception && typeof (exception as any).code === 'string') {
        const code = (exception as any).code;
        if (code === 'P2002') {
          status = HttpStatus.CONFLICT;
          message = 'A record with this unique field already exists';
        } else if (code === 'P2025') {
          status = HttpStatus.NOT_FOUND;
          message = 'Record not found';
        } else {
          message = exception.message;
        }
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      success: false,
      message,
      data: null,
    });
  }
}
