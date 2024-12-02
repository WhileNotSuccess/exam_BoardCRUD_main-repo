import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDTO } from "./dto/category.dto";
import { AuthGuard } from "@nestjs/passport";



@Controller('category')
export class CategoryController{
    constructor(
        private readonly service:CategoryService
    ){}
    @Get()
    async getCategory(){
        return await this.service.getCategory()
    }
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async postCategory(@Body()body:CategoryDTO){
        return await this.service.postCategory(body)
    }
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async putCategory(@Param()id:number,@Body()body:CategoryDTO){
        return await this.service.updateCategory(id,body)
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteCategory(@Param()id:number){
        return await this.service.deleteCategory(id)
    }
}