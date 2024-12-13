import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import { request } from 'http';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') { // 이 자체가 구글전략을 만드는거고 여러가지 인증방식을 각각 하나의 Strategy라고 부름
   //인증방식,'google'은 식별 이름, AuthGuard에도 똑같이 써야함
  constructor(
    private authService: AuthService,
    private readonly config:ConfigService
) {
    super({ //PassportStrategy의 생성자를 부르는 코드, 구글 OAuth서버와 통신하여 인증정보요청 
      clientID: config.get<string>('GOOGLE_CLIENT_ID'),  // 환경변수에 지정해놓은 값 들고오기, 구글로그인시도 가능
      clientSecret: config.get<string>('GOOGLE_SECRET'), // 환경변수에 지정해놓은 값 들고오기, 구글한테 받은값이 암호화되있어서 암호화를 풀때 필요
      callbackURL: config.get<string>('GOOGLE_CALLBACK_URL'), // 로그인 인증 후 리디렉션 될 url,로그인성공했을때 어디로갈거냐
      scope:['email','profile']  // 구글에서 가져올 데이터 : email과 프로필정보
    });
  }

  async validate(
    accessToken: string, // 자리 채우기용, 없으면 profile을 받아오는게 아니라 profile자리에 accessToken을 받음
    refreshToken: string, // 자리 채우기용, 마찬가지
    profile: Profile, 
    done: VerifyCallback,
  ) {
    
    const user = await this.authService.validateUser({  // 구글에서 가져온 정보로 사용자를 찾거나 생성함
        googleId:profile.id,
        name:profile.displayName,
        profilePicture:profile.photos[0].value
    });
    if(!user){
        throw new InternalServerErrorException('유저 데이터베이스 관련 오류') // 유저가 없을수가 없음 원래 DB에 유저가 없으면 그대로 생성하니까 
    }
    
    done(null, user);  // 이 문장이 실행되야 request.user(사용자 정보)를 할수 있음, done함수는 error와 user, info(선택사항)을 인자로 받는다.
    // error에 null을 주면 에러가 없다라는 뜻, user는 인증이 성공했을때 request.user에 할당해준다
    // 인증과정에서 에러가 뜨면 error에 new error를 전달
  }
}
