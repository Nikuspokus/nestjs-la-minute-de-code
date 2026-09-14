import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module.js';
import { UserappController } from './userapp.controller.js';
import { UserappService } from './userapp.service.js';

@Module({
  imports: [DatabaseModule],
  controllers: [UserappController],
  providers: [UserappService],
})
export class UserappModule {}
