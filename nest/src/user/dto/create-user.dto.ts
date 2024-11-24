import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        description:'유저 이름',
        example:'홍길동'
    })
    @IsString()
    name:string

    @ApiProperty({
    description:'유저 프로필 사진',
    example:'https://example.com/profile.jpg'
    })
    @IsString()
    profilePicture:string
    
    @ApiProperty({
    description:'유저 구글 아이디',
    example:'1234567890'
    })
    @IsString()
    googleId:string
}
