import { Test, TestingModule } from '@nestjs/testing';
import { HireController } from './hire.controller';

describe('Hire Controller', () => {
  let controller: HireController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HireController],
    }).compile();

    controller = module.get<HireController>(HireController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
