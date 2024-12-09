import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule, utilities } from 'nest-winston';
import * as winston from 'winston'
import { HttpExceptionFilter } from './common/http-exception.filter';
async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    logger:WinstonModule.createLogger({
      transports:[
        new winston.transports.Console({
          level: 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            utilities.format.nestLike('exam_boardcrud_main', {prettyPrint: true})
          )
        })
      ]
    }),
  });

  app.useGlobalFilters(new HttpExceptionFilter())

  
  const config = new DocumentBuilder()
    .setTitle('final exam team 4')
    .setDescription('final exam team 4')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    methods:'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
    credentials:true
  })
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }))
  app.use(cookieParser()) // 헤더의 쿠키값을 분석하고 객체형태로 변환해줌
  await app.listen(process.env.PORT ?? 3000);
  
}
bootstrap();
