import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CategoryDTO } from "./dto/category.dto";
import { AuthGuard } from "@nestjs/passport";
import { ApiOkResponse, ApiOperation, ApiUnauthorizedResponse } from "@nestjs/swagger";

@Controller('category')
export class CategoryController {
    constructor(
        private readonly service: CategoryService
    ) {}

    @Get()
    @ApiOperation({ summary: 'Request all categories' })
    @ApiOkResponse({ description: 'Successfully retrieved all categories' })
    async getCategory() {
        return await this.service.getCategory();
    }

    @Post()
    @ApiOperation({ summary: 'Create a new category' })
    @ApiOkResponse({ description: 'Category created successfully' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @UseGuards(AuthGuard('jwt'))
    async postCategory(@Body() body: CategoryDTO, @Req() req:any){
        return await this.service.postCategory(body,req.user)
    }
   

    @Put(':id')
    @ApiOperation({ summary: 'Update an existing category' })
    @ApiOkResponse({ description: 'Category updated successfully' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @UseGuards(AuthGuard('jwt'))
    async putCategory(@Param('id') id: number, @Body() body: CategoryDTO) {
        return await this.service.updateCategory(id, body);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an existing category' })
    @ApiOkResponse({ description: 'Category deleted successfully' })
    @ApiUnauthorizedResponse({ description: 'Unauthorized' })
    @UseGuards(AuthGuard('jwt'))
    async deleteCategory(@Param('id') id: number) {
        return await this.service.deleteCategory(id);
    }
}
