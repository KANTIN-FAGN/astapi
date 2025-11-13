import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {PrismaModule} from './prisma/prisma.module';
import {VincentModule} from './vincent/vincent.module';
import {UsersModule} from './users/users.module';
import {AuthModule} from './auth/auth.module';

@Module({
    imports: [PrismaModule, AuthModule, UsersModule, VincentModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
