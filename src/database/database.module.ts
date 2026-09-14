import { Module } from '@nestjs/common';
import { DatabaseController } from './database.controller.js';
import { DatabaseService } from './database.service.js';

@Module({
  providers: [DatabaseService],
  controllers: [DatabaseController],
  exports: [DatabaseService],
})
export class DatabaseModule {}
