import { IsNumber, IsPositive, IsString } from "class-validator"

export class CreateCommentDto {
  @IsPositive() // post_id가 양수인지 확인하는 데커레이터, IsNagative()는 음수인지 확인하는 데커레이터
  @IsNumber()
  postId : number

  @IsString()
  content :string
  
}
