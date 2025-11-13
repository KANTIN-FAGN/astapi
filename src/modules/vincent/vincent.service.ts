import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateVincentDto } from './dto/create-vincent.dto';
import { UpdateVincentDto } from './dto/update-vincent.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import * as fs from 'fs-extra';
import { Prisma } from '@prisma/client';

@Injectable()
export class VincentService {
    constructor(private prisma: PrismaService) {}

    async create(createVincentDto: CreateVincentDto, file: Express.Multer.File) {
        const { title, description } = createVincentDto;

        if (!title) throw new BadRequestException('Titre requis');
        if (!file || !file.mimetype?.startsWith('image/')) {
            throw new BadRequestException('Format de fichier invalide, image requise');
        }

        const uploadDir = join(process.cwd(), 'uploads', 'vincent');
        const finalPath = join(uploadDir, file.filename);

        try {
            const existing = await this.prisma.photo.findUnique({ where: { title } });
            if (existing) throw new BadRequestException(`Un Vincent intitulé '${title}' existe déjà`);

            await fs.ensureDir(uploadDir);
            await fs.move(file.path, finalPath);

            const article = await this.prisma.photo.create({
                data: {
                    title,
                    description,
                    imagePath: '/uploads/vincent/' + file.filename,
                },
                include: { author: true },
            });

            return article;
        } catch (e: any) {
            // Nettoyage si move échoue partiellement (optionnel)
            // if (await fs.pathExists(finalPath)) await fs.remove(finalPath);

            if (e instanceof BadRequestException) throw e;
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') throw new BadRequestException('Titre déjà utilisé');
                throw new BadRequestException(`Erreur base de données (${e.code})`);
            }
            throw new BadRequestException('Création Vincent impossible');
        }
    }

    async findAll(page: number, limit: number) {
        try {
            const safePage = Math.max(1, Number(page) || 1);
            const safeLimit = Math.min(100, Math.max(1, Number(limit) || 10));
            const skip = (safePage - 1) * safeLimit;

            const [data, total] = await this.prisma.$transaction([
                this.prisma.photo.findMany({
                    skip,
                    take: safeLimit,
                    orderBy: { createdAt: 'asc' },
                    include: { author: true },
                }),
                this.prisma.photo.count(),
            ]);

            return { data, total, page: safePage, limit: safeLimit };
        } catch (e: any) {
            throw new BadRequestException('Récupération des Vincents impossible');
        }
    }

    async findOne(id: number) {
        try {
            const item = await this.prisma.photo.findUnique({
                where: { id },
                include: { author: true },
            });
            if (!item) throw new NotFoundException('Vincent introuvable');
            return item;
        } catch (e: any) {
            if (e instanceof NotFoundException) throw e;
            throw new BadRequestException('Récupération du Vincent impossible');
        }
    }

    async update(id: number, updateVincentDto: UpdateVincentDto) {
        try {
            const updated = await this.prisma.photo.update({
                where: { id },
                data: updateVincentDto,
                include: { author: true },
            });
            return updated;
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') throw new BadRequestException('Titre déjà utilisé');
                if (e.code === 'P2025') throw new NotFoundException('Vincent introuvable');
                throw new BadRequestException(`Erreur base de données (${e.code})`);
            }
            throw new BadRequestException('Mise à jour Vincent impossible');
        }
    }

    async remove(id: number) {
        try {
            const deleted = await this.prisma.photo.delete({
                where: { id },
                include: { author: true },
            });
            return deleted;
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') throw new NotFoundException('Vincent introuvable');
                throw new BadRequestException(`Erreur base de données (${e.code})`);
            }
            throw new BadRequestException('Suppression Vincent impossible');
        }
    }
}