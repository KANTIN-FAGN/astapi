import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateVincentDto} from './dto/create-vincent.dto';
import {UpdateVincentDto} from './dto/update-vincent.dto';
import {PrismaService} from 'src/prisma/prisma.service';
import {join} from "path";
import * as fs from 'fs-extra';

@Injectable()
export class VincentService {
    constructor(private prisma: PrismaService) {
    }

    async create(createVincentDto: CreateVincentDto, file: Express.Multer.File) {
        const {title, description} = createVincentDto;

        if (!file || !file.mimetype.startsWith('image/')) {
            throw new BadRequestException(
                'Invalid file format, only images are allowed.',
            );
        }

        const uploadDir = join(process.cwd(), 'uploads', 'vincent');
        const finalPath = join(uploadDir, file.filename);

        const existingArticle = await this.prisma.photo.findUnique({
            where: { title },
        });
        if (existingArticle) {
            throw new BadRequestException(
                `An Vincent with the title '${title}' already exists.`,
            );
        }

        try {
            // S'assurer que le répertoire existe
            await fs.ensureDir(uploadDir);

            // Déplacer le fichier vers sa destination finale
            await fs.move(file.path, finalPath);

            const article = await this.prisma.photo.create({
                data: {
                    title,
                    description,
                    imagePath: '/uploads/vincent/' + file.filename,
                },
            });

            return article;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    findAll() {
        return this.prisma.photo.findMany();
    }

    findOne(id: number) {
        return this.prisma.photo.findUnique({where: {id}});
    }

    update(id: number, updateVincentDto: UpdateVincentDto) {
        return this.prisma.photo.update({
            where: { id },
            data: updateVincentDto,
        });
    }

    remove(id: number) {
        return this.prisma.photo.delete({where: {id}});
    }
}
