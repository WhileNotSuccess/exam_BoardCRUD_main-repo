import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { CommentsModule } from './comments/comments.module';
import { S3Module } from './s3/s3.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { Comment } from './comments/entities/comment.entity';
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entities/category.entity';
import { Post } from './post/entities/post.entity';
import { NestedCommentModule } from './nested-comment/nested-comment.module';
import { NestedComment } from './nested-comment/entities/nested-comment.entity';
import * as winston from 'winston'
import { WinstonModule } from 'nest-winston';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/http-exception.filter';
import { Admin } from './user/entities/admin.entity';

@Module({
  imports: [
    NestjsFormDataModule.config({storage:MemoryStoredFile}),
    TypeOrmModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(config:ConfigService)=>({
        type:'mysql',
        host:config.get<string>('DB_HOST'),
        port:config.get<number>('DB_PORT'),
        username:config.get<string>('DB_USERNAME'),
        password:config.get<string>('DB_PASSWORD'),
        database:config.get<string>('DB_DATABASE'),
        entities:[User, Comment,Category,Post, NestedComment, Admin],
        synchronize:false
      })
    }),
    // WinstonModule.forRoot({

    //   transports:[
    //     new winston.transports.Console({
    //       level: 'silly' ,
    //       format: winston.format.combine(
    //         winston.format.colorize(),
    //         winston.format.timestamp(),
    //         winston.format.printf(({ timestamp, level, message })=>{
    //           return `${timestamp} [${level}]: ${message}`;
    //         })
    //       )
    //     }),
    //     new winston.transports.File({
    //       filename: 'exam_BoardCRUD.log',
    //       level: 'warn',
    //       format: winston.format.combine(
    //         winston.format.timestamp(),
    //         winston.format.printf(({ timestamp, level, message }) => {
    //           return `${timestamp} [${level}]: ${message}`;
    //       })
    //     )
    //     })
    //   ]

    // }),
    ConfigModule.forRoot({
    isGlobal: true,
  }), 
  AuthModule, UserModule, CommentsModule,S3Module, PostModule, CategoryModule,NestedCommentModule],
  controllers: [AppController],
  providers: [AppService,
  //   {
  //   provide: APP_FILTER,
  //   useClass: HttpExceptionFilter
  // }
],
})
export class AppModule {}
