import { ConflictException, Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class UserappService {
  constructor(private readonly databaseService: DatabaseService) {}

  private async handleUniqueEmail<T>(operation: Promise<T>): Promise<T> {
    try {
      return await operation;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already in use');
      }
      throw error;
    }
  }

  create(createUser: Prisma.UserCreateInput) {
    return this.handleUniqueEmail(
      this.databaseService.user.create({ data: createUser }),
    );
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
    return this.handleUniqueEmail(
      this.databaseService.user.update({
        where: { id },
        data: updateUser,
      }),
    );
  }

  remove(id: number) {
    return this.databaseService.user.delete({
      where: { id },
    });
  }
}
