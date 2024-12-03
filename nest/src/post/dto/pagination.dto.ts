import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString} from "class-validator";


export class PaginationDTO{
    @IsInt()
    @IsPositive()
    @IsOptional()
    page?:number;

    @IsInt()
    @IsPositive()
    @IsOptional()
    @ApiProperty({
        example:1,
        description:'limit',
        default:1,
        required:false
    })
    limit?:number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example:'category',
        description:'category',
        default:1,
        required:false
    })
    category?:string;
}