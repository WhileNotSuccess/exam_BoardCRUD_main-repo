import { IsInt, IsOptional, IsPositive, IsString} from "class-validator";

export class PaginationDTO{
    @IsInt()
    @IsPositive()
    @IsOptional()
    skip:number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    limit:number;

    @IsString()
    @IsOptional()
    category:string;
}