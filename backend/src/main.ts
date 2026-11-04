import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import * as compression from 'compression';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security and compression
  app.use(helmet());
  const compressFn = typeof compression === 'function' ? compression : (compression as any).default;
  if (compressFn) app.use(compressFn());
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://localhost:3001'];
    
  // Allow both the www and non-www variant of every configured origin
  const corsOrigins = new Set<string>();
  for (const o of allowedOrigins) {
    const clean = o.replace(/\/+$/, '');
    corsOrigins.add(clean);
    if (!/localhost|127\.0\.0\.1/.test(clean)) {
      const m = clean.match(/^(https?:\/\/)(www\.)?(.+)$/);
      if (m) corsOrigins.add(`${m[1]}${m[2] ? '' : 'www.'}${m[3]}`);
    }
  }

  app.enableCors({
    origin: Array.from(corsOrigins),
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api/v1');

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Global interceptors and filters
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Udan Cabs API')
    .setDescription('The Udan Cabs API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
