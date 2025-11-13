import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class VincentEntity {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    imagePath: string;

    @ApiProperty({ nullable: true })
    description: string | null;

    @ApiProperty({ required: false, nullable: true })
    authorId: string | null; // <- string, pas number

    @ApiProperty({ required: false, type: UserEntity, nullable: true })
    author?: UserEntity | null;

    constructor(input: Partial<VincentEntity> & { author?: Partial<UserEntity> | null }) {
        const { author, ...data } = input ?? {};
        Object.assign(this, data);
        this.author = author ? new UserEntity(author as any) : null;
    }
}