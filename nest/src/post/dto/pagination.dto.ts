import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsPositive, IsString} from "class-validator";


export class PaginationDTO{
    
    @IsOptional()
    @IsInt()
    @IsPositive()
    page?:number;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @ApiProperty({
        example:1,
        description:'limit',
        default:1,
        required:false
    })
    limit?:number;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example:'category',
        description:'category',
        default:1,
        required:false
    })
    category?:string;
}