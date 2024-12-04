import { Module } from '@nestjs/common';
import { NestedCommentService } from './nested-comment.service';
import { NestedCommentController } from './nested-comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NestedComment } from './entities/nested-comment.entity';
@Module({
  controllers: [NestedCommentController],
  providers: [NestedCommentService],
})

export class NestedCommentModule {}