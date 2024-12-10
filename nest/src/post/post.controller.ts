import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import { PostService } from "./post.service";
import { postDTO } from "./dto/post.dto";
import { PaginationDTO } from "./dto/pagination.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiProperty, ApiPropertyOptional, ApiQuery, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";
import { http } from "winston";
import { SearchDTO } from "./dto/search.dto";

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
    findAll(@Query('')query:PaginationDTO){
        return this.post.findPostAll({page:query.page??1,limit:query.limit??10,category:query.category??'자유게시판'})
    }

    @ApiOperation({summary:'검색 페이지',description:'사용자의 검색내용을 띄어쓰기(%20)를 -으로 바꿔 보내고, 백엔드에서 -를 기준으로 배열 생성, 배열 값 중 하나라도 포함하면 응답'})
    @ApiOkResponse({
        example:{
            data:[{},{}],
            totalPage:'number',
            currentPage:'number',
            nextPage:'url',
            prevPage:'url',
    }})
    @ApiQuery({
        name:'category',
        description:'게시글 카테고리',
        example:'자유게시판',
        required:false
    })
    @ApiQuery({
        name:'content',
        description:'검색 내용',
        example:'안녕-잘가'
    })
    @ApiQuery({
        name:'target',
        description:'검색대상',
        example:'title,content,author'
    })
    @ApiQuery({
        name:'limit',
        description:'페이지당 게시글 수',
        example:'10',
        required:false
    })
    @ApiQuery({
        name:'page',
        description:'현재 페이지',
        example:'1,2',
        required:false
    })
    @Get('search')
    search(@Query()body:SearchDTO){
        const bodyProps= {
            category:body.category??'%', //category 기본값 *
            content:body.content,  //찾을 내용
            target:body.target, //제목, 내용, 작성자 중 하나 검색
            limit:body.limit??10, //제한 수: 기본값10
            page:body.page??1 //페이지 수 기본값 1
        }
        // console.log(bodyProps)
        return this.post.findPostSearch(bodyProps)
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