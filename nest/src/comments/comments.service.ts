import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsService {
  constructor(@InjectRepository(Comment) private readonly commentRepository : Repository<Comment>){}

  async create(createCommentDto: CreateCommentDto) {
    const newComment = this.commentRepository.create(createCommentDto)
    await this.commentRepository.save(newComment);
    return{
      message : "성공했어요"
    }
  }

  async findAll(post_id:number) {
    const comment = await this.commentRepository.findBy({post_id : post_id})
    return  comment
  }

  async findOne(id: number) {
    const comment = await this.commentRepository.findOneBy({id : id})  
    return {
      data : comment
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    const a = await this.commentRepository.findOne({where:{id}})
    if (a){
      try{
        await this.commentRepository.update(id,updateCommentDto)
      }
      catch(e){
        throw new BadGatewayException()
      }
    }
    return updateCommentDto
  }

  async remove(id: number) {
    // const deleteComment = await this.commentRepository.findOne()
    return `This action removes a ${id} comment`;
  }
}