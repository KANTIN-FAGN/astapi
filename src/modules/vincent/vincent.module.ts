import {Module} from '@nestjs/common';
import {VincentService} from './vincent.service';
import {VincentController} from './vincent.controller';
import {PrismaModule} from "../../prisma/prisma.module";

@Module({
    controllers: [VincentController],
    providers: [VincentService],
    imports: [PrismaModule],

})
export class VincentModule {
}
