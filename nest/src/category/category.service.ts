import { BadGatewayException, BadRequestException, ConflictException, Injectable } from "@nestjs/common";
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
    
    // 카테고리 이름 받기
    async getCategory(){
        const cate= await this.dataSource.manager.find(Category)
        return cate;
    }
    //카테고리 신규 작성
    async postCategory(body:CategoryDTO,user:any){
        
        
        const category= await this.dataSource.manager.exists(Category,{where:{name:body.name}})
        if(category){
            throw new ConflictException('already exists name')
        }else{
            const queryRunner= this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();
            try {
                await queryRunner.manager.save(Category,body)
                await queryRunner.commitTransaction()
                return 'post success'
            } catch (e) {
                await queryRunner.rollbackTransaction();
                throw new BadRequestException(`${e.sqlMessage}`)
            }finally{
                await queryRunner.release()
            }
        }
    }
    //카테고리 삭제
    async deleteCategory(id:number){
        const queryRunner= this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try{
            await queryRunner.manager.delete(Category,id);
            await queryRunner.commitTransaction();
            return 'delete success'
        }catch(e){
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`${e.sqlMessage}`)
        }finally{
            await queryRunner.release();
        }
        
    }
    //카테고리 이름 변경
    async updateCategory(id:number,body:CategoryDTO){
        const queryRunner= this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.update(Category,id,body)
            await queryRunner.commitTransaction();
            return 'put success' 
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new BadRequestException(`${e.sqlMessage}`)
        }finally{
            await queryRunner.release();
        }
    }
}