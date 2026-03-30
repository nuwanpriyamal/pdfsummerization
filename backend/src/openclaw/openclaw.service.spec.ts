import { Test, TestingModule } from '@nestjs/testing';
import { OpenclawService } from './openclaw.service';

describe('OpenclawService', () => {
  let service: OpenclawService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OpenclawService],
    }).compile();

    service = module.get<OpenclawService>(OpenclawService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
