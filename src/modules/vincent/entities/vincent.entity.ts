
import { ApiProperty } from '@nestjs/swagger';

export class AuthorEntity {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty({ nullable: true })
    name: string | null;

    @ApiProperty()
    email: string;

    constructor(partial: Partial<AuthorEntity>) {
        Object.assign(this, partial);
    }
}

export class VincentEntity {
    @ApiProperty()
    id: number;

    @ApiProperty()
    title: string;

    @ApiProperty()
    imagePath: string;

    @ApiProperty({ required: false, nullable: true })
    description: string | null;

    @ApiProperty({ nullable: true })
    authorId: string | null;

    @ApiProperty({ type: AuthorEntity, nullable: true, required: false })
    author?: AuthorEntity | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    constructor(partial: Partial<VincentEntity>) {
        Object.assign(this, partial);
        // Gérer le cas où author peut être null ou undefined
        if (partial.author !== undefined && partial.author !== null) {
            this.author = new AuthorEntity(partial.author as any);
        } else {
            this.author = partial.author as any;
        }
    }
}