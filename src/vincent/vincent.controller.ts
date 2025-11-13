import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VincentService } from './vincent.service';
import { CreateVincentDto } from './dto/create-vincent.dto';
import { UpdateVincentDto } from './dto/update-vincent.dto';

@Controller('vincent')
export class VincentController {
  constructor(private readonly vincentService: VincentService) {}

  @Post()
  create(@Body() createVincentDto: CreateVincentDto) {
    return this.vincentService.create(createVincentDto);
  }

  @Get()
  findAll() {
    return this.vincentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vincentService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVincentDto: UpdateVincentDto) {
    return this.vincentService.update(+id, updateVincentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vincentService.remove(+id);
  }
}
