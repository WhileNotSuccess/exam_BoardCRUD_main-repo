import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { DataSource, Repository } from "typeorm";
import { CategoryDTO } from "./dto/category.dto";
import { error } from "console";

@Injectable()
export class CategoryService{
    constructor(
        private readonly dataSource:DataSource
    ){}
    queryRunner=this.dataSource.createQueryRunner();
    
    // 카테고리 이름 받기
    async getCategory(){
        const cate= await this.queryRunner.manager.find(Category)
        return cate;
    }
    //카테고리 신규 작성
    async postCategory(body:CategoryDTO){
        const category= await this.queryRunner.manager.exists(Category,{where:{name:body.name}})
        if(category){
            throw new ConflictException('already exists name')
        }else{
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            try {
                await this.queryRunner.manager.save(Category,body)
                await this.queryRunner.commitTransaction()
                return 'post success'
            } catch (e) {
                await this.queryRunner.rollbackTransaction();
                throw error(e)
            }finally{
                await this.queryRunner.release()
            }
        }
    }
    //카테고리 삭제
    async deleteCategory(id:number){
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
        try{
            await this.queryRunner.manager.delete(Category,id);
            await this.queryRunner.commitTransaction();
            return 'delete success'
        }catch(e){
            await this.queryRunner.rollbackTransaction();
            throw error(e)
        }finally{
            await this.queryRunner.release();
        }
        
    }
    //카테고리 이름 변경
    async updateCategory(id:number,body:CategoryDTO){
        await this.queryRunner.connect();
        await this.queryRunner.startTransaction();
        try {
            await this.queryRunner.manager.update(Category,id,body)
            await this.queryRunner.commitTransaction();
            return 'put success' 
        } catch (e) {
            await this.queryRunner.rollbackTransaction();
            throw error(e)
        }finally{
            await this.queryRunner.release();
        }
    }
}