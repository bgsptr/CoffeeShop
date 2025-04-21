import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as jwt from "jsonwebtoken";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // app.use(jwt({
  //   secret: "secret",
  //   getToken: req => req.cookies.token
  // }))
  
  app.enableCors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true
  })
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
