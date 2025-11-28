import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {join} from "path";
import {NestExpressApplication} from "@nestjs/platform-express";
import {ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:4200'],
        credentials: true,
        methods: ['GET','POST','PATCH','DELETE','PUT','OPTIONS'],
        allowedHeaders: ['Content-Type','Authorization'],
    });

    app.setGlobalPrefix('api/v1', {
        exclude: ['/api/v1/uploads/(.*)']
    });

    app.useStaticAssets(join(process.cwd(), 'uploads'), {
        prefix: '/api/v1/uploads/',
    });

    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));


    const config = new DocumentBuilder()
        .setTitle('Astapi')
        .setDescription('The Asta API description')
        .setVersion('0.1')
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();