import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { DataSource, Repository } from 'typeorm';
import { NestedCommentService } from 'src/nested-comment/nested-comment.service';
import { NestedComment } from 'src/nested-comment/entities/nested-comment.entity';
import { error } from 'console';

//트랜잭션은 수정 삭제 추가에서 사용 단순히 GET에서는 할필요 없음
@Injectable()
export class CommentsService {
  constructor(private readonly dataSource : DataSource, private readonly nestedCommentService : NestedCommentService){}
  

  async create(createCommentDto: CreateCommentDto, req:string) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const queryRunnerA =  queryRunner.manager.create(Comment,createCommentDto) // Comment엔티티의 열 모두 가져옴
      queryRunnerA.author = req //이때의 author는 원래 null이었음
      await queryRunner.manager.save(queryRunnerA)
      await queryRunner.commitTransaction()
      return{
        message : "추가 성공했어요"
      }
    }catch(e){
      
      await queryRunner.rollbackTransaction()
      throw new BadRequestException(`${e.sqlMessage}`)
    }
    finally{
      await queryRunner.release()
    }
    
  }

  async findAll(postId:number) {
    return {
      data: await this.dataSource.manager.findBy(Comment,{postId:postId})
    }
  }
  async update(id: number, updateCommentDto: UpdateCommentDto, req:string) {
    
    const queryRunner = this.dataSource.createQueryRunner()
    const commentAuthor = await queryRunner.manager.findOne(Comment,{where:{id}})
      if (commentAuthor.author !== req){
        throw new ForbiddenException()
      }
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      await queryRunner.manager.update(Comment,id,updateCommentDto)
      await queryRunner.commitTransaction()
      return {
        data : updateCommentDto
      } 
    }catch(e){
      await queryRunner.rollbackTransaction()
      throw new BadRequestException(`${e.sqlMessage}`)
    }
    finally{
      await queryRunner.release()
    }
  }

  async remove(id: number, req:string) {
    
    const commentAuthor = await this.dataSource.manager.findOne(Comment,{where:{id}})
      if (commentAuthor.author !== req){
        throw new ForbiddenException() // 403번에러 권한이 없음
      }
    const a = await this.dataSource.manager.findBy(NestedComment,{commentId:id})
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{

      await this.nestedCommentService.LHsremove(a.map((item)=>item.id))
      await queryRunner.manager.delete(Comment,id)
      await queryRunner.commitTransaction()

      return {
        message : "삭제 성공했습니다"
      }
    }catch(e){
      await queryRunner.rollbackTransaction()
      throw new BadRequestException(`${e.sqlMessage}`)
    }
    finally{
      await queryRunner.release()
    }
  }
}