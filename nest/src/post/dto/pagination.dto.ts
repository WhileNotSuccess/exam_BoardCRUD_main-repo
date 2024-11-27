import { IsInt, IsOptional, IsPositive} from "class-validator";

export class PaginationDTO{
    @IsInt()
    @IsPositive()
    @IsOptional()
    skip:number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    limit:number;
}