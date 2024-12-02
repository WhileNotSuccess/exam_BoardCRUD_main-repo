import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return {data: process.env.FRONTEND_URL};
  }
  // @UseGuards(AuthGuard('jwt'))
  @Get('llll')
  getUser(@Req()req:any){
    return req
  }
}
