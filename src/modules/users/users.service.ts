import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';

export const roundsOfHashing = 10;

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}

    async create(createUserDto: CreateUserDto) {
        try {
            if (!createUserDto.password) throw new BadRequestException('Password requis');
            if (!createUserDto.email) throw new BadRequestException('Email requis');

            createUserDto.password = await bcrypt.hash(createUserDto.password, roundsOfHashing);

            return await this.prisma.user.create({ data: createUserDto });
        } catch (e: any) {
            if (e instanceof BadRequestException) throw e;
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') throw new BadRequestException('Email déjà utilisé');
                throw new BadRequestException(`Erreur base de données (${e.code})`);
            }
            throw new BadRequestException('Création utilisateur impossible');
        }
    }

    async findAll() {
        try {
            return await this.prisma.user.findMany();
        } catch (e: any) {
            throw new BadRequestException('Récupération des utilisateurs impossible');
        }
    }

    async findOne(id: string) {
        try {
            const user = await this.prisma.user.findUnique({ where: { id } });
            if (!user) throw new NotFoundException('Utilisateur introuvable');
            return user;
        } catch (e: any) {
            if (e instanceof NotFoundException) throw e;
            throw new BadRequestException('Récupération de l’utilisateur impossible');
        }
    }

    async update(id: string, updateUserDto: UpdateUserDto) {
        try {
            if (updateUserDto.password) {
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, roundsOfHashing);
            }
            return await this.prisma.user.update({
                where: { id },
                data: updateUserDto,
            });
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2002') throw new BadRequestException('Email déjà utilisé');
                if (e.code === 'P2025') throw new NotFoundException('Utilisateur introuvable');
                throw new BadRequestException(`Erreur base de données (${e.code})`);
            }
            throw new BadRequestException('Mise à jour utilisateur impossible');
        }
    }

    async remove(id: string) {
        try {
            return await this.prisma.user.delete({ where: { id } });
        } catch (e: any) {
            if (e instanceof Prisma.PrismaClientKnownRequestError) {
                if (e.code === 'P2025') throw new NotFoundException('Utilisateur introuvable');
                throw new BadRequestException(`Erreur base de données (${e.code})`);
            }
            throw new BadRequestException('Suppression utilisateur impossible');
        }
    }
}