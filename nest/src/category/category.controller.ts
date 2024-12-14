import { Body, Controller, Delete, Get, Param, Post, Put, Req, Request, UseGuards } from "@nestjs/common";
import { CategoryService } from "./category.service";
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
        return {data:await this.service.getCategory()} 
        
    }
}
