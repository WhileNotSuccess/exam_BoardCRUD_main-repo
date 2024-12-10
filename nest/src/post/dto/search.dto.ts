import { IsNumber, IsOptional, IsString } from "class-validator";

export class SearchDTO{
    @IsString()
    target:'title'|'author'|'content';
    @IsString()
    content:string;
    @IsNumber()
    @IsOptional()
    limit?:number;
    @IsString()
    @IsOptional()
    category?:string;
    @IsNumber()
    @IsOptional()
    page?:number;
}