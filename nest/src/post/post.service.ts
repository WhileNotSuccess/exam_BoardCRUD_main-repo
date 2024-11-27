import { Injectable } from "@nestjs/common";
import { postDTO } from "./dto/post.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "./entities/post.entity";
import { PaginationDTO } from "./dto/pagination.dto";


@Injectable()
export class PostService{
    constructor(
        @InjectRepository(Post)
        private repository:Repository<Post>
    ){}
    
    async findPostById(id:number){
        try{
            return await this.repository.findOneById(id);
        }catch{
            return {message:'not in database'}
        }
    }
    async findPostAll(page:PaginationDTO){
        return await this.repository.find({
            skip:page.skip,
            take:page.limit,
        })
    }
    async deletePost(id:number){
        return await this.repository.delete(id)
    }
    async updatePost(id:number,body:postDTO){
        return await this.repository.update(id,body)
    }
    async uploadPost(body:postDTO){
        return await this.repository.save(body)
    }
}