import { Test, TestingModule } from '@nestjs/testing';
import { UpworkApiService } from './upwork-api.service';

describe('UpworkApiService', () => {
  let service: UpworkApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UpworkApiService],
    }).compile();

    service = module.get<UpworkApiService>(UpworkApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
