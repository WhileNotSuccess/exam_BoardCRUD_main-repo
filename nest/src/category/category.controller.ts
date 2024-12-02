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
    getCategory(){
        return this.service.getCategory()
    }

    // @UseGuards(AuthGuard('jwt'))
    @Post()
    postCategory(@Body()body:CategoryDTO){
        return this.service.postCategory(body)
    }
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    putCategory(@Param()id:number,@Body()body:CategoryDTO){
        return this.service.updateCategory(id,body)
    }
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deleteCategory(@Param()id:number){
        return this.service.deleteCategory(id)
    }
}