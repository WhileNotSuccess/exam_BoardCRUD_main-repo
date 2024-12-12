import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards, Req } from '@nestjs/common';
import { NestedCommentService } from './nested-comment.service';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';
import { UpdateNestedCommentDto } from './dto/update-nested-comment.dto';
import { DataSource } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';

@Controller('nested-comments')
export class NestedCommentController {
  constructor(private readonly nestedCommentService: NestedCommentService, private readonly datasource : DataSource) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createNestedCommentDto: CreateNestedCommentDto, @Req() req: any) {
    return {
      data:  await this.nestedCommentService.create(createNestedCommentDto,req.user.name)
    }
  }

  @Get()
  async getAll(@Query('comment-id') commentId : number) {
    return {
      data: await this.nestedCommentService.findAll(commentId)
    }
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return {
      data: this.nestedCommentService.findOne(id)
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateNestedCommentDto: UpdateNestedCommentDto) {
    return {
      data: this.nestedCommentService.update(id, updateNestedCommentDto)
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return {
      data: this.nestedCommentService.remove(id)
    }
  }
}
