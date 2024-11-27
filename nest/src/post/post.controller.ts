import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { PostService } from "./post.service";
import { postDTO } from "./dto/post.dto";
import { PaginationDTO } from "./dto/pagination.dto";

@Controller('posts')
export class PostController{
    constructor(
        private readonly post:PostService
    ){}
    //페이지네이션 추가
    @Get()
    findAll(@Query()page:PaginationDTO={skip:0,limit:10}){
        return this.post.findPostAll(page)
    }

    @Get(':id')
    findOne(@Param('id')id:number){
        return this.post.findPostById(id)
    }
    @Delete(':id')
    deleteOne(@Param('id')id:number){
        return this.post.deletePost(id)
    }
    @Post()
    postOne(@Body() body:postDTO){
        try {
            this.post.uploadPost(body)
            return {message: 'finished upload'}
        } catch (error) {
            return error
        }
        
    }
    @Put(':id')
    repost(@Param('id')id:number,@Body() body:postDTO){
        this.post.updatePost(id,body)
        return {message:'finished update'}
    }
    
}
