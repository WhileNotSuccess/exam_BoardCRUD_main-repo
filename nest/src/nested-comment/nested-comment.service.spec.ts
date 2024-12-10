import { Test, TestingModule } from '@nestjs/testing';
import { NestedCommentService } from './nested-comment.service';

describe('NestedCommentService', () => {
  let service: NestedCommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NestedCommentService],
    }).compile();

    service = module.get<NestedCommentService>(NestedCommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
