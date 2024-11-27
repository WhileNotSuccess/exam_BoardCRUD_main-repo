import { Module, ValidationPipe } from "@nestjs/common";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";
import { APP_PIPE } from "@nestjs/core";

@Module({
    imports:[],
    controllers:[PostController],
    providers:[
        {provide:APP_PIPE,
            useValue:new ValidationPipe({
                whitelist:true, //DTO에 없는 속성을 제거 처리
                forbidNonWhitelisted:true, // 위에서 제거된 속성이 있을 경우 예외 발생
                transform:true, // 요청 데이터를 자동 변환 )"32"string-> 32 number
                transformOptions:{
                    enableImplicitConversion:true // DTO 속성 타입에 따라 요청 데이터를 암시적 변환
                }
            })
        }
        ,PostService]
})


export class PostModule{}