import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDTO } from "./dto/category.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";



@Controller('category')
export class CategoryController{
    constructor(
        private readonly service:CategoryService
    ){}
    @Get()
    @ApiOperation({summary:'category열 요청'})
    @ApiOkResponse({description:'complete get category'})
    async getCategory(){
        return await this.service.getCategory()
    }
    @ApiOperation({summary:'category post'})
    @ApiOkResponse({description:'complete post category'})
    @ApiUnauthorizedResponse({description:'unauthorized'})
    @UseGuards(AuthGuard('jwt'))
    @Post()
    async postCategory(@Body()body:CategoryDTO){
        return await this.service.postCategory(body)
    }
    @ApiOperation({summary:'category put'})
    @ApiOkResponse({description:'complete post put'})
    @ApiUnauthorizedResponse({description:'unauthorized'})
    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    async putCategory(@Param()id:number,@Body()body:CategoryDTO){
        return await this.service.updateCategory(id,body)
    }
    @ApiOperation({summary:'category delete'})
    @ApiOkResponse({description:'complete post delete'})
    @ApiUnauthorizedResponse({description:'unauthorized'})
    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    async deleteCategory(@Param()id:number){
        return await this.service.deleteCategory(id)
    }
}