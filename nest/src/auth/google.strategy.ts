import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private authService: AuthService,
    private readonly config:ConfigService
) {
    super({
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.get<string>('GOOGLE_SECRET'),
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'),
      scope:['email','profile']
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const user = await this.authService.validateUser({
        googleId:profile.id,
        name:profile.displayName,
        profilePicture:profile.photos[0].value
    });
    if(!user){
        throw new InternalServerErrorException('유저 데이터베이스 관련 오류')
    }
    done(null, user);
  }
}
