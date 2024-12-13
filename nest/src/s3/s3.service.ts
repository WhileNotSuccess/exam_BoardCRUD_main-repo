import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { MemoryStoredFile } from 'nestjs-form-data';
import * as uuid from 'uuid'
@Injectable()
export class S3Service {
  private s3: AWS.S3;
  private bucketName:string;

  constructor(private configService: ConfigService) {
    this.s3 = new AWS.S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: this.configService.get<string>('AWS_DEFAULT_REGION'),
    });
    this.bucketName = this.configService.get<string>('AWS_BUCKET');
  }

  async uploadImageFile(file: MemoryStoredFile): Promise<string>{
    
    const key = `final-exam-image/${uuid.v1()}`

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,         // S3에서 저장될 파일 이름 (final-exam-image 폴더 내에 저장)
      Body: file.buffer,     // 파일 내용
      ContentType: 'image',  // 파일 MIME 타입 설정
    };

    await this.s3.upload(params).promise();
    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }
}
