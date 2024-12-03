import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CommentsModule } from './comments/comments.module';
import { S3Module } from './s3/s3.module';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { Comment } from './comments/entities/comment.entity';

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
        entities:[User, Comment],
        synchronize:true
      })
    }),
    ConfigModule.forRoot({
    isGlobal: true,
  }), 
  AuthModule, UserModule, CommentsModule,S3Module],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
