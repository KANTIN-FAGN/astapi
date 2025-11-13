import { Test, TestingModule } from '@nestjs/testing';
import { VincentService } from './vincent.service';

describe('VincentService', () => {
  let service: VincentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VincentService],
    }).compile();

    service = module.get<VincentService>(VincentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
