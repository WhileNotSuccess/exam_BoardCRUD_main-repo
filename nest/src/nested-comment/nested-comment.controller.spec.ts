import { Test, TestingModule } from '@nestjs/testing';
import { NestedCommentController } from './nested-comment.controller';
import { NestedCommentService } from './nested-comment.service';

describe('NestedCommentController', () => {
  let controller: NestedCommentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NestedCommentController],
      providers: [NestedCommentService],
    }).compile();

    controller = module.get<NestedCommentController>(NestedCommentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
