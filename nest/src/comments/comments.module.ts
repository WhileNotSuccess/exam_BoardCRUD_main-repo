import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { NestedCommentModule } from 'src/nested-comment/nested-comment.module';

@Module({
  imports: [NestedCommentModule],
  exports:[CommentsService],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
