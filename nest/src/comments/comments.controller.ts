import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards, Req } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createCommentDto: CreateCommentDto, @Req()req : any
) {    
    return await this.commentsService.create(createCommentDto,req.user.name
    );
  }

  @Get()
  async getAll(@Query('post-id') postId:number){
    return await this.commentsService.findAll(postId)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':comment')  // :는 숫자로 받아오겠다
  update(@Param('comment') id: number, @Body() updateCommentDto: UpdateCommentDto, @Req()req : any) {
    return this.commentsService.update(id, updateCommentDto, req.user.name);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  remove(@Param('id') id: number, @Req()req : any) {
    return this.commentsService.remove(id, req.user.name);
  }
}