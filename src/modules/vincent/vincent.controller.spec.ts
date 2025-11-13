import { Test, TestingModule } from '@nestjs/testing';
import { VincentController } from './vincent.controller';
import { VincentService } from './vincent.service';

describe('VincentController', () => {
  let controller: VincentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VincentController],
      providers: [VincentService],
    }).compile();

    controller = module.get<VincentController>(VincentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
