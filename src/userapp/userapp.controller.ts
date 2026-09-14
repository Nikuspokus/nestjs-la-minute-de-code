import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UserappService } from './userapp.service.js';

@Controller('usersapp')
export class UserappController {
  constructor(private readonly userappService: UserappService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createUser: Prisma.UserCreateInput) {
    const user = this.userappService.create(createUser);
    if (!user) {
      throw new BadRequestException('Failed to create user');
    }
    return user;
  }

  @Get()
  @HttpCode(200)
  findAll(@Query('role') role?: string) {
    const users = this.userappService.findAll(role);
    if (!users) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id', ParseIntPipe) id: number) {
    const user = this.userappService.findOne(id);
    if (!user) {
      throw new NotFoundException('No user found');
    }
    return user;
  }

  @Patch(':id')
  @HttpCode(200)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: Prisma.UserUpdateInput,
  ) {
    const user = this.userappService.update(id, updateUser);
    if (!user) {
      throw new BadRequestException('Failed to update user');
    }
    return user;
  }

  @Delete(':id')
  @HttpCode(200)
  remove(@Param('id', ParseIntPipe) id: number) {
    const user = this.userappService.remove(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
