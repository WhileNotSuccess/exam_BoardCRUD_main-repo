import { IsNumber, IsString } from "class-validator";

export class CreateNestedCommentDto {
  @IsNumber()
  commentId:number;
  @IsString()
  content: string;
}
