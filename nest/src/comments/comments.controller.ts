import { Controller, Get, Post, Body, Param, Delete, Query, Put } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(@Body() createCommentDto: CreateCommentDto) {
    return await this.commentsService.create(createCommentDto);
  }

  @Get()
  async getAll(@Query('post-id') postId:number){
    return await this.commentsService.findAll(postId)
  }

  @Get(':id') // 특정 게시글의 전체 댓글
  findOne(@Param('id') id: string) {
    return this.commentsService.findOne(+id);
  }

  @Put(':comment')
  update(@Param('comment') id: number, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentsService.update(+id, updateCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(+id);
  }
}