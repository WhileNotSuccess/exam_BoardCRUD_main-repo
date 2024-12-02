import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { postDTO } from "./dto/post.dto";
import { PaginationDTO } from "./dto/pagination.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('posts')
@Controller('posts')
export class PostController{
    constructor(
        private readonly post:PostService
    ){}
    @Get('check')
    re(){
        return this.post.check()
    }
    @Get() //pagination 메인 페이지 post
    findAll(@Query('page')page:number,
            @Query('limit')limit:number,
            @Query('category')category:string){
        return this.post.findPostAll({page:page?page:1,limit:limit?limit:10,category:category?category:'ksnf'})
    }
    // listin에서 게시글 상세 보기
    @Get(':id')
    findOne(@Param('id')id:number){
        return this.post.findPostById(id)
    }
    // 게시글 삭제
    //게시글 삭제시 관련 댓글, 대댓글도 삭제
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deleteOne(@Param('id')id:number, @Req()req:any){
        return this.post.deletePost(id,req.user.name)
    }
    // 게시글 등록
    @UseGuards(AuthGuard('jwt'))
    @Post()
    postOne(@Body() body:postDTO, @Req()req:any){
        return this.post.uploadPost(body,req.user.name)
    }
    //게시글 수정
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    repost(@Param('id')id:number,@Body() body:postDTO, @Req()req:any){
        return this.post.updatePost(id,body,req.user.name)
    }
}  