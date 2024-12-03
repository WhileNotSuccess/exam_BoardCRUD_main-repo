import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class postDTO{
    @IsString()
    @ApiProperty({
        example:'title',
        description:'title',
    })
    title:string;
    @IsString()
    @ApiProperty({
        example:'content',
        description:'content',
    })
    content:string;
    @IsString()
    @ApiProperty({
        example:'category',
        description:'category',
    })
    category:string;
}