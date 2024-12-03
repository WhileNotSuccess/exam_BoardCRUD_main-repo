import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class CategoryDTO{
    @IsString()
    @ApiProperty({
        example:'category_name',
        description:'category_name',
    })
    name:string
}