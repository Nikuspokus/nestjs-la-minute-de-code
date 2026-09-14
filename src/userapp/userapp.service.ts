import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class UserappService {
  constructor(private readonly databaseService: DatabaseService) {}
  create(createUser: Prisma.UserCreateInput) {
    return this.databaseService.user.create({
      data: createUser,
    });
  }

  findAll(role?: string) {
    if (role) {
      return this.databaseService.user.findMany({
        where: {
          role: role as Role,
        },
      });
    }
    return this.databaseService.user.findMany();
  }

  findOne(id: number) {
    return this.databaseService.user.findUnique({
      where: { id },
    });
  }

  update(id: number, updateUser: Prisma.UserUpdateInput) {
    return this.databaseService.user.update({
      where: { id },
      data: updateUser,
    });
  }

  remove(id: number) {
    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
