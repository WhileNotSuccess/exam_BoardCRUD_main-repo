import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { postDTO } from "./dto/post.dto";
import { DataSource } from "typeorm";
import { Post } from "./entities/post.entity";
import { PaginationDTO } from "./dto/pagination.dto";
import { error } from "console";
import { SearchDTO } from "./dto/search.dto";
import { Category } from "src/category/entities/category.entity";
import { CommentsService } from "src/comments/comments.service";
import { Comment } from "src/comments/entities/comment.entity";


@Injectable()
export class PostService{
    constructor(
        private readonly dataSource:DataSource,
        private commentService:CommentsService
    ){}
    
    async findPostById(id:number){
        
        const returnValue=await this.dataSource.manager.findOne(Post,{where:{id:id}})
        return {data:returnValue}
    }
  
    async findPostSearch(body: SearchDTO) {
 
        const findArray: string[] = body.content.split(' ').filter(value => value !== '') 
            .map(element => `%${element}%`);
        
        const queryBuilder = this.dataSource.createQueryBuilder().select('post').from(Post, 'post');
    
        findArray.forEach((element, index) => {
            queryBuilder.orWhere(`${body.target} LIKE :element${index}`, { [`element${index}`]: element });
        });
    
        queryBuilder.andWhere('category LIKE :category', { category: body.category })
            .skip((body.page - 1) * body.limit)
            .take(body.limit)
            .orderBy('createdAt', 'DESC');
    
        const [search, total] = await queryBuilder.getManyAndCount();
        
        const totalPage = Math.ceil(total / body.limit);
        const currentPage = body.page;
        const nextPage = currentPage < totalPage ? `http://localhost:3012/posts/search?category=${body.category}&content=${body.content}&limit=${body.limit}&target=${body.target}&page=${currentPage + 1}` : null;
        const prevPage = currentPage > 1 ? `http://localhost:3012/posts/search?category=${body.category}&content=${body.content}&limit=${body.limit}&target=${body.target}&page=${currentPage - 1}` : null;
    
        return {
            data: search,
            totalPage,
            currentPage,
            nextPage,
            prevPage
        };
    }
    
    async findPostAll(page:PaginationDTO){  //skip=1 limit=10 category=자유게시판
        
        const [search,total]=await this.dataSource.manager.findAndCount(Post,{
            skip:(page.page-1)*page.limit,
            take:page.limit,
            where:{category:page.category},
            order:{createdAt:'DESC'}
        })

        const totalPage=Math.ceil(total/page.limit)
        const currentPage=page.page
        const nextPage=totalPage-currentPage?`http://localhost:3012/posts?page=${currentPage+1}`:null
        const prevPage=currentPage-1?`http://localhost:3012/posts?page=${currentPage-1}`:null
        
        return search?{data:search,totalPage,currentPage,nextPage,prevPage}:null
    }
    async deletePost(id:number,user:string){
        
        const post= await this.dataSource.manager.findOneBy(Post,{id:id})
        if(user!=post.author){
            throw new ForbiddenException('작성자가 아닙니다.')
        }
        const commentsIds=await this.dataSource.createQueryBuilder()
        .select('Comment.id').from(Comment,'Comment').where('postId = :id',{id:id}).getMany()

        const queryRunner=this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await Promise.all(
                commentsIds.map(async data=>await this.commentService.remove(data.id,user))
            )
            await queryRunner.manager.delete(Post,id)
            await queryRunner.commitTransaction()
            return 'finished delete'
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw new BadRequestException(`${e.sqlMessage}`)
        }finally{
            await queryRunner.release()
        }
    }
    async updatePost(id:number,body:postDTO,user:string){
        
        const post=await this.dataSource.manager.findOneBy(Post,{id:id})
        if(user!=post.author){
            throw new ForbiddenException()
        }
        const queryRunner=this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            await queryRunner.manager.update(Post,id,body)
            await queryRunner.commitTransaction()
            return 'finished update'
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw new BadRequestException(`${e.sqlMessage}`)
        }finally{
            await queryRunner.release()
        }
    }
    async uploadPost(body:postDTO,user:string){
        const queryRunner=this.dataSource.createQueryRunner();
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try { 
            const postContent={...body,author:user}
            await queryRunner.manager.save(Post,postContent)
            await queryRunner.commitTransaction()
            return 'finished upload'
        } catch (e) {
            await queryRunner.rollbackTransaction()
            throw new BadRequestException(`${e.sqlMessage}`)
        }finally{
            await queryRunner.release()
        }
    }
    
}