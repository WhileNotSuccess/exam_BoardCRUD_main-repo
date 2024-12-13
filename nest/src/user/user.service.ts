import { BadRequestException, Injectable } from '@nestjs/common';
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
    return await this.dataSource.manager.findBy(User,{id:id})
  }
  async createNewUser(createUserDto: CreateUserDto) {
    const queryRunner = await this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const user = await queryRunner.manager.save(User, createUserDto)
      await queryRunner.commitTransaction()
      return user
    }catch(e){
      await queryRunner.rollbackTransaction()
      throw new BadRequestException(`${e.sqlMessage}`)
    }finally{
      await queryRunner.release()
    }

  }

  async findOneByGoogleId(id:string){
    return await this.dataSource.manager.findOneBy(User,{googleId: id})
  }
}
