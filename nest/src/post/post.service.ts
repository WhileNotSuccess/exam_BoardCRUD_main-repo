import { Injectable, UnauthorizedException } from "@nestjs/common";
import { postDTO } from "./dto/post.dto";
import { DataSource } from "typeorm";
import { Post } from "./entities/post.entity";
import { PaginationDTO } from "./dto/pagination.dto";
import { error } from "console";


@Injectable()
export class PostService{
    constructor(
        private readonly dataSource:DataSource
    ){}
    queryRunner=this.dataSource.createQueryRunner();

    async check(){
        return await this.queryRunner.manager.find(Post)
    }

    async findPostById(id:number){
        try{
            return await this.queryRunner.manager.findAndCount(Post,{where:{id:id}})
        }catch(e){
            throw e
        }
    }
    async findPostAll(page:PaginationDTO){  //skip=1 limit=10 category=skiej
        const [category,total]=await this.queryRunner.manager.findAndCount(Post,{
            skip:(page.page-1)*page.limit,
            take:page.limit,
            where:{category:page.category},
            order:{created_at:'DESC'}
        })
        const totalPage=Math.ceil(total/page.limit)
        const currentPage=page.page
        const nextPage=totalPage-currentPage?`http://localhost:3000/posts?page=${currentPage+1}`:null
        const prevPage=currentPage-1?`http://localhost:3000/posts?page=${currentPage-1}`:null
        if(totalPage!>=currentPage){
            return {data:category,totalPage,currentPage,nextPage,prevPage}
        }else{
            throw error
        }
    }
    async deletePost(id:number,user:string){
        const post=await this.queryRunner.manager.findOneBy(Post,{id:id})
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
        if(user!=post.author){
                throw UnauthorizedException
        }
        try {
            await this.queryRunner.manager.delete(Post,id)
            await this.queryRunner.commitTransaction()
            return 'finished delete'
        } catch (e) {
            await this.queryRunner.rollbackTransaction()
            throw e
        }finally{
            await this.queryRunner.release()
        }
    }
    async updatePost(id:number,body:postDTO,user:string){
        const post=await this.queryRunner.manager.findOneBy(Post,{id:id})
        if(user!=post.author){
            throw UnauthorizedException
        }
        await this.queryRunner.connect()
        await this.queryRunner.startTransaction()
        try {
            await this.queryRunner.manager.update(Post,id,body)
            await this.queryRunner.commitTransaction()
            return 'finished update'
        } catch (e) {
            await this.queryRunner.rollbackTransaction()
            throw error(e)
        }finally{
            await this.queryRunner.release()
        }
    }
    async uploadPost(body:postDTO,user:string){
        await this.queryRunner.connect()
        await this.queryRunner.startTransaction()
        try { 
            const postContent={...body,author:user}
            await this.queryRunner.manager.save(Post,postContent)
            await this.queryRunner.commitTransaction()
            return 'finished upload'
        } catch (e) {
            await this.queryRunner.rollbackTransaction()
            throw error(e)
        }finally{
            await this.queryRunner.release()
        }
    }
}