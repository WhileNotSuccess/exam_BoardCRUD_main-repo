import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({summary:'로그인된 유저의 정보'})
  @ApiResponse({
    status:HttpStatus.OK,
    example:{
      id:1,
      name:'문성윤',
      profilePicture:'https://imgurl.com',
      googleId:'54421231548',
    }
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('info')
  test(@Req() request){
    return request.user
  }
}
