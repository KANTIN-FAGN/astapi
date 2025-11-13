import { ApiProperty } from '@nestjs/swagger';

export class VincentEntity {
    constructor(data: Partial<VincentEntity>) {
        Object.assign(this, data);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    imagePath: string;

    @ApiProperty({ nullable: true })
    description: string | null;
}