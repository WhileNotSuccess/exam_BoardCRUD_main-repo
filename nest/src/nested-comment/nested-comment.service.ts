import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';
import { UpdateNestedCommentDto } from './dto/update-nested-comment.dto';
import { NestedComment } from './entities/nested-comment.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class NestedCommentService {
  constructor(private readonly dataSource: DataSource) {}


  async create(createNestedCommentDto: CreateNestedCommentDto,name:string) {
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const comment = queryRunner.manager.create(NestedComment, createNestedCommentDto);
      comment.author = name
      await queryRunner.manager.save(comment);
      await queryRunner.commitTransaction();
      return { message: '대댓글 추가를 성공했습니다' };
    } catch (e) {
      
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`${e.sqlMessage}`)
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(commentId: number) {
    return await this.dataSource.manager.findBy(NestedComment, { commentId: commentId })
  }

  async findOne(id: number) {
    return await this.dataSource.manager.findOneBy(NestedComment, { id: id });
  }

  async update(id: number, updateNestedCommentDto: UpdateNestedCommentDto, name:string) {
    const target = await this.dataSource.manager.findOneBy(NestedComment,{id})
    if(target.author !== name){
      throw new ForbiddenException('댓글의 작성자가 아닙니다.')
    }
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {


      await queryRunner.manager.update(NestedComment, id, updateNestedCommentDto);
      await queryRunner.commitTransaction();
      return { message: '수정을 성공했습니다.' };
    } catch (e) {

      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`${e.sqlMessage}`)
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number, name:string) {
    const target = await this.dataSource.manager.findOneBy(NestedComment,{id})
    if(target.author !== name){
      throw new ForbiddenException('댓글의 작성자가 아닙니다.')
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.delete(NestedComment, id);
      await queryRunner.commitTransaction();
      return { message: '삭제를 성공했습니다.' };
    } catch (e) {

      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`${e.sqlMessage}`)
    } finally {
      await queryRunner.release();
    }
  }

  async LHsremove(id: number[]) { // 배열을 받고 조건은 id in 배열
    await this.dataSource.createQueryBuilder().from(NestedComment, "nestedComment").delete().whereInIds(id).execute()
  }
}