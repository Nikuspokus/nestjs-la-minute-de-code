import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../common/guards/auth.guard.js';
import type { User } from '../types/usersTypes.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UsersService } from './users.service.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get()
  @HttpCode(200)
  findAll(): User[] {
    return this.usersService.findAll();
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseIntPipe) id: number): User {
    return this.usersService.findOne(id);
  }

  @Get()
  @HttpCode(200)
  findAllWithQuery(
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): string {
    return `This action returns all users (page: ${page}, limit: ${limit})`;
  }

  @Post()
  @HttpCode(201)
  create(@Body() CreateUser: CreateUserDto): User {
    return this.usersService.create(CreateUser);
  }

  @Patch(':id')
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UpdateUserDto,
  ): User {
    return this.usersService.update(id, updateUser);
  }

  @Delete(':id')
  @HttpCode(200)
  delete(@Param('id', ParseIntPipe) id: number): string {
    return this.usersService.delete(id);
  }
}
