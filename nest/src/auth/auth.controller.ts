import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '구글 로그인 페이지로 이동' })
  @Get('google/login')
  @UseGuards(AuthGuard('google'))
  handleLogin(){
    return 'login'
  }
  
  @ApiExcludeEndpoint()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async handleRedirect(@Req() request, @Res() response) {
    const user = request.user
    const token = await this.authService.login(user)
    response.cookie('auth_token', token.access_token,{
      httpOnly:false,
      secure:false,
      maxAge:1000*60*60,
      sameSite:'Lax'
    })
    response.redirect(`${process.env.FRONTEND_URL}/user`)
  }
}
