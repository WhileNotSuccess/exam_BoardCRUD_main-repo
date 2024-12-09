import { Injectable, UnauthorizedException } from "@nestjs/common";
import { postDTO } from "./dto/post.dto";
import { DataSource } from "typeorm";
import { Post } from "./entities/post.entity";
import { PaginationDTO } from "./dto/pagination.dto";
import { error } from "console";
import { SearchDTO } from "./dto/search.dto";


@Injectable()
export class PostService{
    constructor(
        private readonly dataSource:DataSource
    ){}
    queryRunner=this.dataSource.createQueryRunner();

    async findPostById(id:number){
        const returnValue=await this.queryRunner.manager.find(Post,{where:{id:id}})
        return {data:returnValue}
    }
  
    async findPostSearch(body:SearchDTO){
        const findArray:string[]=body.content.split('-').filter(value=>value!=='') 
        //sql injection의 공통점:뒤의 조건식을 --로 주석 처리=>query로 받으며, 띄어쓰기를 - 기준으로 구분함으로 --를 무력화
            .map(element=>`%${element}%`)
        const [search,total]=await this.dataSource.createQueryBuilder().select('post').from(Post,'post')
        .where('('+findArray.map((element)=>`${body.target} LIKE '${element}'`).join(' OR ')+')') // => where (__LIKE__ OR __LIKE___)
        .andWhere(`category='${body.category}'`)
        .setFindOptions({
            skip:(body.page-1)*body.limit,  //건너뛸 개수
            take:body.limit,                //불러올 개수
            order:{created_at:'DESC'} })    //정렬할 조건
        .getManyAndCount()
        // .getSql()
        const totalPage=Math.ceil(total/body.limit) 
        const currentPage=body.page
        const nextPage=totalPage-currentPage?`http://localhost:3012/posts?search=${currentPage+1}`:null
        const prevPage=currentPage-1?`http://localhost:3012/posts?search=${currentPage-1}`:null

        return {data:search,totalPage,currentPage,nextPage,prevPage}
        // return search
    }
    async findPostAll(page:PaginationDTO){  //skip=1 limit=10 category=skiej
        
        const [search,total]=await this.queryRunner.manager.findAndCount(Post,{
            skip:(page.page-1)*page.limit,
            take:page.limit,
            where:{category:page.category},
            order:{created_at:'DESC'}
        }).catch()
        const totalPage=Math.ceil(total/page.limit)
        const currentPage=page.page
        const nextPage=totalPage-currentPage?`http://localhost:3012/posts?page=${currentPage+1}`:null
        const prevPage=currentPage-1?`http://localhost:3012/posts?page=${currentPage-1}`:null
        
        return search?{data:search,totalPage,currentPage,nextPage,prevPage}:null
    }
    async deletePost(id:number,user:string){
        const post= await this.queryRunner.manager.findOneBy(Post,{id:id})
        if(user!=post.author){
            throw UnauthorizedException
        }
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
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