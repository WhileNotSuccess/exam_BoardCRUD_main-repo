import { PartialType } from '@nestjs/swagger';
import { CreateNestedCommentDto } from './create-nested-comment.dto';

export class UpdateNestedCommentDto extends PartialType(CreateNestedCommentDto) {}
