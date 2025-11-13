import {
    ArrayNotEmpty,
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    MinLength,
    ValidateNested,
} from 'class-validator'
import {ApiProperty} from "@nestjs/swagger";

export class CreateVincentDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @ApiProperty()
    title: string;

    @IsString()
    @MinLength(10)
    @ApiProperty({ required: false })
    description?: string;
}
