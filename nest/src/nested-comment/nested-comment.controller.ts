import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { NestedCommentService } from './nested-comment.service';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';
import { UpdateNestedCommentDto } from './dto/update-nested-comment.dto';

@Controller('nested_comment')
export class NestedCommentController {
  constructor(private readonly nestedCommentService: NestedCommentService) {}
  
  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() createNestedCommentDto: CreateNestedCommentDto) {
    return  await this.nestedCommentService.create(createNestedCommentDto);
  }

  @Get()
  getAll(@Query('comment-id') commentId : number) {
    return this.nestedCommentService.findAll(commentId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nestedCommentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNestedCommentDto: UpdateNestedCommentDto) {
    return this.nestedCommentService.update(+id, updateNestedCommentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nestedCommentService.remove(+id);
  }
}
