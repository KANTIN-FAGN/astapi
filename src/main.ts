import {NestFactory, Reflector} from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import {join} from "path";
import {NestExpressApplication} from "@nestjs/platform-express";
import {ClassSerializerInterceptor, ValidationPipe} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors({
        origin: ['http://localhost:3000'],
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
        .setTitle('ASTAPI')
        .setDescription(`
            API RESTful pour la gestion complète d'une application web moderne.
            
            Cette API fournit les fonctionnalités suivantes :
            • Authentification et autorisation sécurisées via JWT
            • Gestion des utilisateurs et des profils
            • Upload et gestion des fichiers médias
            • Endpoints CRUD complets avec validation des données
            • Support CORS pour les applications front-end
            
            **Base URL:** http://localhost:3000/api/v1
            
            **Authentification:** 
            Utilisez le token Bearer JWT dans l'en-tête Authorization pour accéder aux endpoints protégés.
            
            **Format des réponses:** JSON
            
            **Gestion des erreurs:** 
            Les erreurs sont retournées avec des codes HTTP appropriés et des messages détaillés.
        `)
        .setVersion('0.1')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Entrez votre token JWT',
                in: 'header',
            },
            'JWT-auth',
        )
        .addTag('Authentication', 'Endpoints pour l\'authentification et l\'autorisation')
        .addTag('Users', 'Gestion des utilisateurs')
        .addTag('Files', 'Upload et gestion des fichiers')
        .setContact(
            'Support API',
            'https://kantin-fagniart.vercel.app/',
            'kantin.fagniart@ynov.com'
        )
        .setLicense('MIT', 'https://opensource.org/licenses/MIT')
        .addServer('http://localhost:3000/api/v1', 'Serveur de développement')
        .addServer('https://kantin.vitoderiu.com/api/v1', 'Serveur de production')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1', app, document);

    await app.listen(process.env.PORT || 3000);
}
bootstrap();