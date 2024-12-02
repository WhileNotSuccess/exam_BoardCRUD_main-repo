import { Injectable } from "@nestjs/common";
import { postDTO } from "./dto/post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { PaginationDTO } from "./dto/pagination.dto";


@Injectable()
export class PostService{
    constructor(
        @InjectRepository(Post)private repository:Repository<Post>
    ){}
    async findPostById(id:number){
        try{
            return await this.repository.findOneById(id);
        }catch(e){
            throw e
        }
    }
    async findPostAll(page:PaginationDTO){
        const [category,total]=await this.repository.findAndCount({
            skip:(page.skip-1)*page.limit,
            take:page.limit,
            where:{category:page.category},
            order:{created_at:'DESC'}
        })
        const last_page=Math.ceil(total/page.limit)
        if(last_page>=page.skip){
            return {data:category,last_page}
        }else{
            throw 'pagination error'
        }
    }
    async deletePost(id:number,user:string){
        const post=await this.repository.findOneById(id)
        try {
            if(user!=post.author){
                throw 'unauthorized'
            }
            await this.repository.delete(id)
            return 'finished delete'
        } catch (e) {
            throw e
        }
    }
    async updatePost(id:number,body:postDTO,user:string){
        const post=await this.repository.findOneById(id)
        try {
            if(user!=post.author){
                throw 'unauthorized'
            }
            await this.repository.update(id,body)
            return 'finished update'
        } catch (e) {
            throw e
        }
    }
    async uploadPost(body:postDTO,user:string){
        try {  
            const postContent={...body,author:user}
            await this.repository.save(postContent)
            return 'finished upload'
        } catch (e) {
            throw e
        }
    }
}