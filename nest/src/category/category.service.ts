import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Category } from "./entities/category.entity";
import { DataSource, Repository } from "typeorm";
import { CategoryDTO } from "./dto/category.dto";

@Injectable()
export class CategoryService{
    constructor(
        @InjectRepository(Category)private readonly repository:Repository<Category>,
        private readonly dataSource:DataSource
    ){}
    queryRunner=this.dataSource.createQueryRunner();
    
    // 카테고리 이름 받기
    async getCategory(){
        console.log('1');
        const cate= await this.repository.find();
        console.log('2',cate);
        return cate;
    }
    //카테고리 신규 작성
    async postCategory(body:CategoryDTO){
        const category=await this.repository.exists({where:{name:body.name}})
        if(category){
            throw new ConflictException('already exists name')
        }else{
            await this.queryRunner.connect();
            await this.queryRunner.startTransaction();
            try {
                await this.queryRunner.manager.save(Category,body)
                await this.queryRunner.commitTransaction()
            } catch (e) {
                await this.queryRunner.rollbackTransaction();
                throw e
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
        }catch(e){
            await this.queryRunner.rollbackTransaction();
            throw e
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
        } catch (e) {
            await this.queryRunner.rollbackTransaction();
            throw e
        }finally{
            await this.queryRunner.release();
        }
    }
}