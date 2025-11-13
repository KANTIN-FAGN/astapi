import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    UploadedFile,
    BadRequestException, ParseIntPipe, UseGuards
} from '@nestjs/common';
import {diskStorage} from 'multer';
import {VincentService} from './vincent.service';
import {CreateVincentDto} from './dto/create-vincent.dto';
import {UpdateVincentDto} from './dto/update-vincent.dto';
import {extname} from "path";
import {FileInterceptor} from "@nestjs/platform-express";
import {ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiResponse, ApiTags} from "@nestjs/swagger";
import {VincentEntity} from "./entities/vincent.entity";
import {ERROR} from "../common/contants/error.constants";
import {SwaggerResponses} from "../common/contants/swagger.constants";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('vincent')
@ApiTags('vincent')
export class VincentController {
    constructor(private readonly vincentService: VincentService) {
    }

    @Post()
    @ApiResponse(SwaggerResponses.ErrorServer)
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse({
        type: VincentEntity,
        description: 'Vincent successfully created.',
    })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        description: 'Créer un Vincent avec image',
        schema: {
            type: 'object',
            properties: {
                title: {type: 'string', minLength: 5},
                description: {type: 'string', minLength: 10, nullable: true},
                imagePath: {
                    type: 'string',
                    format: 'binary',
                    description: 'Fichier image à uploader',
                },
            },
            required: ['title', 'imagePath'],
        },
    })
    @UseInterceptors(
        FileInterceptor('imagePath', {
            storage: diskStorage({
                destination: './temp',
                filename: (req, file, cb) => {
                    const uniqueSuffix =
                        Date.now() + '-' + Math.round(Math.random() * 1e9);
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
        }),
    )
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createArticleDto: CreateVincentDto,
    ) {
        if (!file) {
            throw new BadRequestException(ERROR.InvalidInputFormat);
        }
        try {
            return new VincentEntity(
                await this.vincentService.create(createArticleDto, file),
            );
        } catch (error) {
            if (error instanceof BadRequestException) {
                throw error;
            }

            throw new BadRequestException(ERROR.InvalidInputFormat);
        }
    }

    @Get()
    @ApiResponse(SwaggerResponses.ErrorServer)
    @ApiResponse({
        status: 200,
        description: 'Liste des Vincents',
        type: [VincentEntity],
    })
    async findAll() {
        const articles = await this.vincentService.findAll();
        return articles.map((article) => new VincentEntity(article));
    }

    @Get(':id')
    @ApiResponse(SwaggerResponses.ErrorServer)
    async findOne(@Param('id', ParseIntPipe) id: number) {
        const photo = await this.vincentService.findOne(id);
        if (!photo) {
            return null;
        }
        return photo
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse(SwaggerResponses.ErrorServer)
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateArticleDto: UpdateVincentDto,
    ) {
        return new VincentEntity(
            await this.vincentService.update(id, updateArticleDto),
        );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiResponse(SwaggerResponses.ErrorServer)
    async remove(@Param('id', ParseIntPipe) id: number) {
        return new VincentEntity(await this.vincentService.remove(id));
    }
}
