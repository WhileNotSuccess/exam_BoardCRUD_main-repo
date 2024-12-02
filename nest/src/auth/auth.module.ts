import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleStrategy } from './google.strategy';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports:[UserModule,
    PassportModule.register({
    session:false
  }),
  JwtModule.registerAsync({
    inject:[ConfigService],
    useFactory:(config:ConfigService)=>({
      secret:config.get<string>('JWT_SECRET'),
      signOptions:{expiresIn:'1h'}
    })
  }),
],
  controllers: [AuthController],
  providers: [AuthService,GoogleStrategy,JwtStrategy],
})
export class AuthModule {}
