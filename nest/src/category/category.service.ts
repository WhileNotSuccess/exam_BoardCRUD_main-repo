import { BadGatewayException, BadRequestException, ConflictException, Injectable } from "@nestjs/common";

import { Category } from "./entities/category.entity";
import { DataSource } from "typeorm";


@Injectable()
export class CategoryService{
    constructor(
        private readonly dataSource:DataSource
    ){}
    
    // 카테고리 이름 받기
    async getCategory(){
        return {
            data: await this.dataSource.manager.find(Category)
        };
    }
    
}