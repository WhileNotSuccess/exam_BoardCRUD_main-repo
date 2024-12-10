import { PartialType } from '@nestjs/swagger';
import { CreateCommentDto } from './create-comment.dto';
import { IsString } from 'class-validator';

export class UpdateCommentDto  {
  @IsString()
  content: string;
}
