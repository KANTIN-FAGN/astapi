import { Injectable } from '@nestjs/common';
import { CreateVincentDto } from './dto/create-vincent.dto';
import { UpdateVincentDto } from './dto/update-vincent.dto';

@Injectable()
export class VincentService {
  create(createVincentDto: CreateVincentDto) {
    return 'This action adds a new vincent';
  }

  findAll() {
    return `This action returns all vincent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} vincent`;
  }

  update(id: number, updateVincentDto: UpdateVincentDto) {
    return `This action updates a #${id} vincent`;
  }

  remove(id: number) {
    return `This action removes a #${id} vincent`;
  }
}
