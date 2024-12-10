import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { DataSource, Repository } from 'typeorm';
import { NestedCommentService } from 'src/nested-comment/nested-comment.service';
import { NestedComment } from 'src/nested-comment/entities/nested-comment.entity';

//트랜잭션은 수정 삭제 추가에서 사용 단순히 GET에서는 할필요 없음
@Injectable()
export class CommentsService {
  constructor(private readonly dataSource : DataSource, private readonly nestedCommentService : NestedCommentService){}
  queryRunner = this.dataSource.createQueryRunner()

  async create(createCommentDto: CreateCommentDto, req:string) {
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
    try{
      const queryRunnerA =  this.queryRunner.manager.create(Comment,createCommentDto) // Comment엔티티의 열 모두 가져옴
      queryRunnerA.author = req //이때의 author는 원래 null이었음
      await this.queryRunner.manager.save(queryRunnerA)
      await this.queryRunner.commitTransaction()
      return{
        message : "추가 성공했어요"
      }
    }catch(e){
      console.log(e)
      await this.queryRunner.rollbackTransaction()
      
    }
    finally{
      await this.queryRunner.release()
    }
    
  }

  async findAll(postId:number) {
    return {
      data: await this.dataSource.manager.findBy(Comment,{postId:postId})
    }
  }


  async update(id: number, updateCommentDto: UpdateCommentDto) {
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
    try{
      await this.queryRunner.manager.update(Comment,id,updateCommentDto)
      await this.queryRunner.commitTransaction()
      return {
        data : updateCommentDto
      } 
    }catch(e){
      await this.queryRunner.rollbackTransaction()
    }
    finally{
      await this.queryRunner.release()
    }
  }

  async remove(id: number) {
    const a = await this.dataSource.manager.findBy(NestedComment,{commentId:id})
    await this.queryRunner.connect()
    await this.queryRunner.startTransaction()
    try{
      console.log(a)
      await this.nestedCommentService.LHsremove(a.map((item)=>item.id))
      await this.queryRunner.manager.delete(Comment,id)
      await this.queryRunner.commitTransaction()

      return {
        message : "삭제 성공했습니다"
      }
    }catch(e){
      await this.queryRunner.rollbackTransaction()
      return {
        message : "삭제 실패하였습니다"
      }
    }
    finally{
      await this.queryRunner.release()
    }
  }
}