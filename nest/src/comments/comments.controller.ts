import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards, Req, Headers } from '@nestjs/common';
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

  @Get('search')
  async getPostsCommentedByUser(@Query('limit') limit:number,@Query('page') page:number, @Query('content') header:string){
    const name=header.replace('%20',' ') // %20은 URL 인코딩에서 띄어쓰기를 나타내는 문자열
    return await this.commentsService.getUserComment(limit??10,page??1,name)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':comment')  // :는 숫자로 받아오겠다
  async update(@Param('comment') id: number, @Body() updateCommentDto: UpdateCommentDto, @Req()req : any) {
    return await this.commentsService.update(id, updateCommentDto, req.user.name);
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Req()req : any) {
    return await this.commentsService.remove(id, req.user.name);
  }
}