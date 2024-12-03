import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly dataSource:DataSource
  ){}
  async findUserById(id:number){
    return this.dataSource.manager.findBy(User,{id:id})
  }
  async createNewUser(createUserDto: CreateUserDto) {
    let user = null;
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      user = await queryRunner.manager.save(User, createUserDto)
      await queryRunner.commitTransaction()
    }catch(e){
      await queryRunner.rollbackTransaction()
      console.error(e)
      throw e
    }finally{
      await queryRunner.release()
    }

    return user
  }

  async findOneByGoogleId(id:string){
    return await this.dataSource.manager.findOneBy(User,{googleId: id})
  }
}
