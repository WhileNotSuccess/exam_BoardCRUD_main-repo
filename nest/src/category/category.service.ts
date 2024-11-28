import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { Repository } from "typeorm";
import { CategoryDTO } from "./dto/category.dto";

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category)private readonly repository:Repository<Category>
    ){}

    async getCategory(){
        return await this.repository.find()
    }
    async postCategory(name:CategoryDTO){
        const category=await this.repository.exists({where:{name:name.name}})
        if(category){
            throw 'already exist this category name'
        }
        return await this.repository.save(name)
    }
    async deleteCategory(id:number){
        try{
            await this.repository.delete(id)
        }catch(e){
            throw e
        }
    }
    async updateCategory(id:number,body:CategoryDTO){
        try {
            await this.repository.update(id,body)
        } catch (e) {
            throw e
        }
    }
}