import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.enableCors(); // 允许跨域
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // 过滤 DTO 中未定义的字段
      transform: true, // 自动把请求体转成 DTO 实例
    }),
  );
  app.use(cookieParser()); // 解析 cookie
  app.use(
    session({
      secret: configService.get('SESSION_SECRET') || 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );

  // 配置 Swagger 文档 OpenAPI 规范
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swaggerApi', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
