import { Injectable } from '@nestjs/common';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';
import { UpdateNestedCommentDto } from './dto/update-nested-comment.dto';
import { NestedComment } from './entities/nested-comment.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class NestedCommentService {
  constructor(private readonly dataSource : DataSource){}
  
  queryRunner = this.dataSource.createQueryRunner()
  
  async create(createNestedCommentDto: CreateNestedCommentDto) {
    
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
    
    try {
      const a = this.queryRunner.manager.create(NestedComment,createNestedCommentDto)
      a.author = "진모"
      await this.queryRunner.manager.save(a)
      await this.queryRunner.commitTransaction()

    }catch(e){
      await this.queryRunner.rollbackTransaction()
    
    }finally{
      await this.queryRunner.release()
    
    }
    return {message:"성공입니다"}
  }

  async findAll(commentId: number) {
    return await this.dataSource.manager.findBy(NestedComment,{id:commentId});
  }

  async findOne(id: number) {
    return await this.dataSource.manager.findOneBy(NestedComment,{id:id})
  }
  
  update(id: number, updateNestedCommentDto: UpdateNestedCommentDto) {
    return `This action updates a #${id} nestedComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} nestedComment`;
  }
}
