import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { NestedCommentService } from './nested-comment.service';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';
import { UpdateNestedCommentDto } from './dto/update-nested-comment.dto';
import { DataSource } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('nested_comment')
export class NestedCommentController {
  constructor(private readonly nestedCommentService: NestedCommentService, private readonly datasource : DataSource) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createNestedCommentDto: CreateNestedCommentDto) {
    return  await this.nestedCommentService.create(createNestedCommentDto);
  }

  @Get()
  getAll(@Query('comment_id') commentId : number) {
    return this.nestedCommentService.findAll(commentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nestedCommentService.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNestedCommentDto: UpdateNestedCommentDto) {
    return this.nestedCommentService.update(+id, updateNestedCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
   // return await this.datasource.createQueryBuilder().select('Comment.id').from(Comment,'Comment').where(`postId=${id}`).getMany()
  }
}
