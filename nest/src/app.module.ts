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
import { PostModule } from './post/post.module';
import { CategoryModule } from './category/category.module';
import { Post } from './post/entities/post.entity';
import { Category } from './category/entities/category.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject:[ConfigService], //의존 provider 
      useFactory:(config:ConfigService)=>({ 
        type:'mysql',
        host:config.get<string>('DB_HOST'),
        port:config.get<number>('DB_PORT'),
        username:config.get<string>('DB_USERNAME'),
        password:config.get<string>('DB_PASSWORD'),
        database:config.get<string>('DB_DATABASE'),
        entities:[User,Post,Category],
        synchronize:true
      })
    }),
    ConfigModule.forRoot({
    isGlobal: true,
  }), 
  AuthModule, UserModule,PostModule,CategoryModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
