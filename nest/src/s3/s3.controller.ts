import { Body, Controller, Post, UploadedFile, UseGuards } from '@nestjs/common';
import { S3Service } from './s3.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FormDataRequest } from 'nestjs-form-data';
import { ImageDto } from './dto/image.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('image')
@Controller('s3')
export class S3Controller {
    constructor(private readonly s3Service:S3Service){}

    @Post('image-upload')
    @ApiOperation({summary:'body에 formdata로 이미지를 보내면 s3버킷에 올리고 url 반환'})
    @ApiBody({
        type:ImageDto
    })
    @ApiResponse({
        example:{
            url:'http://imgurl.com'
        }
    })
    @FormDataRequest()
    @UseGuards(AuthGuard('jwt'))
    async imageUpload(@Body() dto: ImageDto){

        return {
            url:await this.s3Service.uploadImageFile(dto.image)
        }
    }
}
