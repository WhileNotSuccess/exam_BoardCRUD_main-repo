import { Injectable } from '@nestjs/common';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';
import { UpdateNestedCommentDto } from './dto/update-nested-comment.dto';
import { NestedComment } from './entities/nested-comment.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class NestedCommentService {
  constructor(private readonly dataSource : DataSource){}
  

  
  async create(createNestedCommentDto: CreateNestedCommentDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    
    try {
      const a = queryRunner.manager.create(NestedComment,createNestedCommentDto)
      a.author = "진모"
      await queryRunner.manager.save(a)
      await queryRunner.commitTransaction()

    }catch(e){
      await queryRunner.rollbackTransaction()
    
    }finally{
      await queryRunner.release()
    
    }
    return {message:"성공입니다"}
  }

  async findAll(commentId: number) {
    return await this.dataSource.manager.findBy(NestedComment,{commentId:commentId});
  }

  async findOne(id: number) {
    return await this.dataSource.manager.findOneBy(NestedComment,{id:id})
  }
  
  update(id: number, updateNestedCommentDto: UpdateNestedCommentDto) {
    return `This action updates a #${id} nestedComment`;
  }

  async LHsremove(id: number[]) { // 배열을 받고 조건은 id in 배열

    const real = await this.dataSource.createQueryBuilder().from(NestedComment, "nestedComment").delete().whereInIds(id).execute()
    
  }
}
