import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { // PassportStrategy의 모든 메서드와 속성을 사용할수 있음
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request) => { // JWT를 추출할 방법
        let token = null;
        if (request && request.cookies) {  // request가 필요한지 의문, request undefined일떄 에러 안남
          token = request.cookies['auth_token']; // 클라이언트의 요청의 쿠키에서 auth_token이름의 jwt토큰을 빼냄
        }
        return token; // return을 해줘야 내부 passport-jwt가 토큰을 받아 secretkey로 검증을 하고 페이로드를 디코딩해서 validate에게 넘겨줄수 있음, 안적으면 undefined로 받음
      }]),
      ignoreExpiration: false, // 토큰만료를 무시할것인지에대한 값으로 false
      secretOrKey: process.env.JWT_SECRET, // JWT_SECRET으로 토큰을 변조한지 안한지 검증
    });
  }

  async validate(payload: any) {
    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('로그인이 필요합니다.');
    }
    return user;
  }
}
