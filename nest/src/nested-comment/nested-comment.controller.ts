import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
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
  async create(@Body() createNestedCommentDto: CreateNestedCommentDto, @Req() req: any) {
    return  await this.nestedCommentService.create(createNestedCommentDto,req.user.name);
  }

  @Get()
  getAll(@Query('comment_id') commentId : number) {
    return this.nestedCommentService.findAll(commentId);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.nestedCommentService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateNestedCommentDto: UpdateNestedCommentDto) {
    return this.nestedCommentService.update(id, updateNestedCommentDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.nestedCommentService.remove(id);
  }
}
