import { Body, Controller, Get, Post } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDTO } from "./dto/category.dto";

@Controller('category')
export class CategoryController{
    constructor(
        private readonly service:CategoryService
    ){}

    @Get()
    async getCategory(){
        this.service
    }

    @Post()
    postCategory(@Body()body:CategoryDTO){
        this.service.postCategory(body)
    }
}