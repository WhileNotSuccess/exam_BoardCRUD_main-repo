import { Injectable } from '@nestjs/common';
import { CreateNestedCommentDto } from './dto/create-nested-comment.dto';
import { UpdateNestedCommentDto } from './dto/update-nested-comment.dto';
import { NestedComment } from './entities/nested-comment.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class NestedCommentService {
  constructor(private readonly dataSource: DataSource) {}


  async create(createNestedCommentDto: CreateNestedCommentDto,req:string) {
    
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {
      const comment = queryRunner.manager.create(NestedComment, createNestedCommentDto);
      comment.author = req
      await queryRunner.manager.save(comment);
      await queryRunner.commitTransaction();
      return { message: '대댓글 추가를 성공했습니다' };
    } catch (e) {
      console.error('대댓글 추가 에러 :', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(commentId: number) {
    return await this.dataSource.manager.findBy(NestedComment, { commentId: commentId });
  }

  async findOne(id: number) {
    return await this.dataSource.manager.findOneBy(NestedComment, { id: id });
  }

  async update(id: number, updateNestedCommentDto: UpdateNestedCommentDto) {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      

      await queryRunner.manager.update(NestedComment, id, updateNestedCommentDto);
      await queryRunner.commitTransaction();
      return { message: '수정을 성공했습니다.' };
    } catch (e) {
      console.error('수정 실패 :', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async remove(id: number) {

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(NestedComment, id);
      await queryRunner.commitTransaction();
      return { message: '삭제를 성공했습니다.' };
    } catch (e) {
      console.error('삭제 실패 :', e);
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async LHsremove(id: number[]) { // 배열을 받고 조건은 id in 배열

    const real = await this.dataSource.createQueryBuilder().from(NestedComment, "nestedComment").delete().whereInIds(id).execute()
    
  }
}