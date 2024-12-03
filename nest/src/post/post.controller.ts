import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { postDTO } from "./dto/post.dto";
import { PaginationDTO } from "./dto/pagination.dto";
import { AuthGuard } from "@nestjs/passport";
import {Post as PostE} from './entities/post.entity'
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiPropertyOptional, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { http } from "winston";

@ApiTags('posts')
@Controller('posts')
export class PostController{
    constructor(
        private readonly post:PostService
    ){}
    @ApiOperation({summary:'메인페이지 pagination'})
    @ApiQuery({
        name:'page',
        description:'현재 페이지',
        example:'1',
        required:false,
    })
    @ApiQuery({
        name:'limit',
        description:'게시글 갯수',
        example:'10',
        required:false,
    })
    @ApiQuery({
        name:'category',
        description:'게시글 카테고리',
        example:'자유게시판',
        required:false
    })
    @ApiOkResponse({
        example:{
            data:[{}],
            totalPage:'number',
            currentPage:'number',
            nextPage:'url',
            prevPage:'url'
        }
    })
    @Get() //pagination 메인 페이지 post
    findAll(@Query('page')page:number,
            @Query('limit')limit:number,
            @Query('category')category:string){
        return this.post.findPostAll({page:page?page:1,limit:limit?limit:10,category:category?category:'ksnf'})
    }

    // listin에서 게시글 상세 보기
    @ApiOperation({summary:'게시글 상세보기'})
    @ApiResponse({
        status:HttpStatus.OK,
        example:{
            id:'number',
            title:"string",
            content:"string",
            author:"string",
            category:"string",
            created_at:"date",
            updated_at:"date",
        }
    })
    @Get(':id')
    findOne(@Param('id')id:number){
        return this.post.findPostById(id)
    }
    // 게시글 삭제
    //게시글 삭제시 관련 댓글, 대댓글도 삭제
    @ApiOperation({summary:'게시글 삭제'})
    @ApiOkResponse({description:'complete delete'})
    @ApiUnauthorizedResponse({description:'unauthorized'})
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deleteOne(@Param('id')id:number, @Req()req:any){
        return this.post.deletePost(id,req.user.name)
    }
    // 게시글 등록
    @ApiOperation({summary:'게시글 등록'})
    @ApiOkResponse({description:'complete post'})
    @ApiUnauthorizedResponse({description:'unauthorized'})
    @UseGuards(AuthGuard('jwt'))
    @Post()
    postOne(@Body() body:postDTO, @Req()req:any){
        return this.post.uploadPost(body,req.user.name)
    }
    //게시글 수정
    @ApiOperation({summary:'게시글 수정'})
    @ApiOkResponse({description:'complete put'})
    @ApiUnauthorizedResponse({description:'unauthorized'})
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    repost(@Param('id')id:number,@Body() body:postDTO, @Req()req:any){
        return this.post.updatePost(id,body,req.user.name)
    }
}  