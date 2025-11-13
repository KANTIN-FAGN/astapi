import { PartialType } from '@nestjs/swagger';
import { CreateVincentDto } from './create-vincent.dto';

export class UpdateVincentDto extends PartialType(CreateVincentDto) {}
