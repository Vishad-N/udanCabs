import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((res) => {
        // If the controller already returned an object with success/message/data structure, use it
        if (res && typeof res === 'object' && 'success' in res && 'data' in res) {
          return res;
        }
        return {
          success: true,
          message: 'Operation completed successfully',
          data: res || {},
        };
      }),
    );
  }
}
