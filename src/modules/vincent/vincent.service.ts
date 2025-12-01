import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateVincentDto} from './dto/create-vincent.dto';
import {UpdateVincentDto} from './dto/update-vincent.dto';
import {PrismaService} from 'src/prisma/prisma.service';
import {join} from 'path';
import * as fs from 'fs-extra';
import {Prisma} from '@prisma/client';

@Injectable()
export class VincentService {
    constructor(private prisma: PrismaService) {
    }

    async create(createVincentDto: CreateVincentDto, file: Express.Multer.File) {
        const {title, description} = createVincentDto;

        if (!title) throw new BadRequestException('Titre requis');
        if (!file || !file.mimetype?.startsWith('image/')) {
            throw new BadRequestException('Format de fichier invalide, image requise');
        }

        const uploadDir = join(process.cwd(), 'uploads', 'vincent');
        const finalPath = join(uploadDir, file.filename);

        try {
            const existing = await this.prisma.photo.findUnique({where: {title}});
            if (existing) throw new BadRequestException(`Un Vincent intitulé '${title}' existe déjà`);

            await fs.ensureDir(uploadDir);
            await fs.move(file.path, finalPath);

            const article = await this.prisma.photo.create({
                data: {
                    title,
                    description,
                    imagePath: 'https://kantin.vitoderiu.com/api/v1/uploads/vincent/' + file.filename,
                },
                include: {author: true},
            });

            return article;
        } catch (e: any) {

            if (await fs.pathExists(finalPath)) await fs.remove(finalPath);

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
                    orderBy: {createdAt: 'asc'},
                    include: {author: true},
                }),
                this.prisma.photo.count(),
            ]);

            return {data, total, page: safePage, limit: safeLimit};
        } catch (e: any) {
            throw new BadRequestException('Récupération des Vincents impossible');
        }
    }

    async findOne(id: number) {
        try {
            const item = await this.prisma.photo.findUnique({
                where: {id},
                include: {author: true},
            });
            if (!item) throw new NotFoundException('Vincent introuvable');
            return item;
        } catch (e: any) {
            if (e instanceof NotFoundException) throw e;
            throw new BadRequestException('Récupération du Vincent impossible');
        }
    }

    async update(id: number, updateVincentDto: UpdateVincentDto, file?: Express.Multer.File) {
        let tempFilePath: string | undefined;

        try {
            // Vérifier que le Vincent existe
            const existing = await this.prisma.photo.findUnique({
                where: {id},
            });

            if (!existing) {
                throw new NotFoundException('Vincent introuvable');
            }

            let imagePath: string | undefined = undefined;

            // Si un nouveau fichier est fourni, le traiter
            if (file) {
                if (!file.mimetype?.startsWith('image/')) {
                    // Supprimer le fichier temporaire si le format est invalide
                    if (file.path && await fs.pathExists(file.path)) {
                        await fs.remove(file.path);
                    }
                    throw new BadRequestException('Format de fichier invalide, image requise');
                }

                const uploadDir = join(process.cwd(), 'uploads', 'vincent');
                const finalPath = join(uploadDir, file.filename);
                tempFilePath = finalPath; // Garder la référence pour le nettoyage en cas d'erreur

                // Déplacer la nouvelle image
                await fs.ensureDir(uploadDir);
                await fs.move(file.path, finalPath);

                imagePath = 'https://kantin.vitoderiu.com/api/v1/uploads/vincent/' + file.filename;
            }

            // Préparer les données à mettre à jour
            const dataToUpdate: any = {
                ...updateVincentDto,
            };

            // Ajouter le chemin de l'image seulement si un nouveau fichier a été fourni
            if (imagePath) {
                dataToUpdate.imagePath = imagePath;
            }

            const updated = await this.prisma.photo.update({
                where: {id},
                data: dataToUpdate,
                include: {author: true},
            });

            // Supprimer l'ancienne image APRÈS la mise à jour réussie
            if (file && existing.imagePath) {
                const oldImageName = existing.imagePath.split('/').pop();
                if (oldImageName) {
                    const oldImagePath = join(process.cwd(), 'uploads', 'vincent', oldImageName);
                    if (await fs.pathExists(oldImagePath)) {
                        await fs.remove(oldImagePath).catch(() => {
                            // Log l'erreur mais ne pas faire échouer l'opération
                            console.error(`Impossible de supprimer l'ancienne image: ${oldImagePath}`);
                        });
                    }
                }
            }

            return updated;
        } catch (e: any) {
            // Nettoyer le nouveau fichier en cas d'erreur
            if (tempFilePath && await fs.pathExists(tempFilePath)) {
                await fs.remove(tempFilePath).catch(() => {});
            }

            if (e instanceof NotFoundException) throw e;
            if (e instanceof BadRequestException) throw e;
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
            // Récupérer d'abord le Vincent pour avoir le chemin de l'image
            const vincent = await this.prisma.photo.findUnique({
                where: {id},
            });

            if (!vincent) {
                throw new NotFoundException('Vincent introuvable');
            }

            // Supprimer de la base de données
            const deleted = await this.prisma.photo.delete({
                where: {id},
                include: {author: true},
            });

            // Supprimer le fichier image après suppression réussie de la BDD
            if (vincent.imagePath) {
                const imageName = vincent.imagePath.split('/').pop();
                if (imageName) {
                    const imagePath = join(process.cwd(), 'uploads', 'vincent', imageName);
                    if (await fs.pathExists(imagePath)) {
                        await fs.remove(imagePath).catch((err) => {
                            console.error(`Impossible de supprimer l'image: ${imagePath}`, err);
                        });
                    }
                }
            }

            return deleted;
        } catch (e: any) {
            if (e instanceof NotFoundException) throw e;
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') throw new NotFoundException('Vincent introuvable');
                if (e.code === 'P2003') throw new BadRequestException('Impossible de supprimer : Vincent référencé ailleurs');
                throw new BadRequestException(`Erreur base de données (${e.code})`);
            }
            throw new BadRequestException('Suppression Vincent impossible');
        }
    }
}