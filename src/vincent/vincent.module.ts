import { Module } from '@nestjs/common';
import { VincentService } from './vincent.service';
import { VincentController } from './vincent.controller';

@Module({
  controllers: [VincentController],
  providers: [VincentService],
})
export class VincentModule {}
