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
        entities:[User, Comment,Category,Post, NestedComment],
        synchronize:true
      })
    }),
    ConfigModule.forRoot({
    isGlobal: true,
  }), 
  AuthModule, UserModule, CommentsModule,S3Module, PostModule, CategoryModule,NestedCommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
