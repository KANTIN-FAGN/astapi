import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
} from '@nestjs/common';
import {UsersService} from './users.service';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import { ApiBearerAuth, ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {UserEntity} from "./entities/user.entity";
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    @ApiCreatedResponse({type: UserEntity})
    async create(@Body() createUserDto: CreateUserDto) {
        return new UserEntity(await this.usersService.create(createUserDto));
    }

    @Get()
    @ApiOkResponse({type: UserEntity, isArray: true})
    async findAll() {
        const users = await this.usersService.findAll();
        return users.map((user) => new UserEntity(user));
    }

    @Get(':id')
    @ApiOkResponse({type: UserEntity})
    async findOne(@Param('id') id: string) { // <- pas ParseIntPipe
        const user = await this.usersService.findOne(id);
        if (!user) return null;
        return new UserEntity(user);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiCreatedResponse({type: UserEntity})
    async update(
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        return new UserEntity(await this.usersService.update(id, updateUserDto));
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOkResponse({type: UserEntity})
    async remove(@Param('id') id: string) {
        return new UserEntity(await this.usersService.remove(id));
    }
}