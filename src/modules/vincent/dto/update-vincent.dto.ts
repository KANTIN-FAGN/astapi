import { PartialType } from '@nestjs/swagger';
import { CreateVincentDto } from './create-vincent.dto';
import {IsOptional} from "class-validator";

export class UpdateVincentDto extends PartialType(CreateVincentDto) {
    @IsOptional()
    imagePath?: string;
}
