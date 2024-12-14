import { BadGatewayException, BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { DataSource, Repository } from 'typeorm';
import { NestedCommentService } from 'src/nested-comment/nested-comment.service';
import { NestedComment } from 'src/nested-comment/entities/nested-comment.entity';
import { error } from 'console';
import { Post } from 'src/post/entities/post.entity';

//트랜잭션은 수정 삭제 추가에서 사용 단순히 GET에서는 할필요 없음
@Injectable()
export class CommentsService {
  constructor(private readonly dataSource : DataSource, private readonly nestedCommentService : NestedCommentService){}
  

  async create(createCommentDto: CreateCommentDto, name:string) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      const newComment =  queryRunner.manager.create(Comment,createCommentDto) // Comment엔티티의 열 모두 가져옴
      newComment.author = name //이때의 author는 원래 null이었음
      await queryRunner.manager.save(newComment)
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

  async update(id: number, updateCommentDto: UpdateCommentDto, name:string) {
    const commentAuthor = await this.dataSource.manager.findOne(Comment,{where:{id}})
      if (commentAuthor.author !== name){
        throw new ForbiddenException()
      }
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try{
      await queryRunner.manager.update(Comment,id,updateCommentDto)
      await queryRunner.commitTransaction()
      return {
        message : '수정 완료'
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
      throw new ForbiddenException('작성자가 아닙니다.') // 403번에러 권한이 없음
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
  async removeByPost(id:number[]){
    const nestedComment=await this.dataSource.createQueryBuilder()
    .select('nestedComment.id').from(NestedComment,'nestedComment')
    .where('nestedComment.commentId IN (:...array)',{array:id}).getMany()

    await this.nestedCommentService.LHsremove(nestedComment.map(item=>item.id))
   
    await this.dataSource.createQueryBuilder().from(Comment,'comment')
    .delete().whereInIds(id).execute() 
     
  }
  async getUserComment(limit:number,page:number,author:string){
    const content=await this.dataSource.createQueryBuilder()
    .select('comment.postId').from(Comment,'comment').where({author:author})
    .getMany()

    const newArray=content.map(item=>item.postId)
    const [returnPost, total] = await this.dataSource.createQueryBuilder()
    .select('post').from(Post, 'post').where('post.id IN (:...array)', { array: newArray })
    .skip((page - 1) * limit).take(limit).orderBy('post.createdAt', 'DESC') 
    .getManyAndCount();
  
    const totalPage=Math.ceil(total/limit)
    const currentPage=page
    const nextPage=totalPage-currentPage?`http://localhost:3012/posts?limit=${limit}}&content=${author}&page=${currentPage+1}`:null
    const prevPage=currentPage-1?`http://localhost:3012/posts?page=${currentPage-1}`:null
    

    return returnPost?{data:returnPost,totalPage,currentPage,nextPage,prevPage}:null
  }
}