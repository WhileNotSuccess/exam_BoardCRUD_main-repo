import { IsString } from "class-validator";

export class postDTO{
    @IsString()
    title:string;
    @IsString()
    content:string;
    @IsString()
    category:string;
}