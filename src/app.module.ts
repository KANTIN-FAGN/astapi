import {Module} from '@nestjs/common';
import {PrismaModule} from './prisma/prisma.module';
import {VincentModule} from './modules/vincent/vincent.module';
import {UsersModule} from './modules/users/users.module';
import {AuthModule} from './modules/auth/auth.module';
import {ThrottlerModule, ThrottlerGuard} from '@nestjs/throttler';
import {APP_GUARD} from "@nestjs/core";

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        UsersModule,
        VincentModule,
        ThrottlerModule.forRoot([
            {name: 'short', ttl: 10000, limit: 5},
        ]),
    ],
    providers: [
        {provide: APP_GUARD, useClass: ThrottlerGuard},
    ],
})
export class AppModule {
}
