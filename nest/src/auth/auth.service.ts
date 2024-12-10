import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { UserDetails } from 'src/common/types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService:JwtService
  ){}

  async validateUser(details: UserDetails){

    const user = await this.userService.findOneByGoogleId(details.googleId)
    if(user) return user;
    return await this.userService.createNewUser({
      name:details.name,
      profilePicture: details.profilePicture, 
      googleId: details.googleId
    })
  }
  
  async login(user:any){
    const payload = {username:user.name, sub:user.id}
    return {
        access_token: await this.jwtService.sign(payload)
    }
  }
}
