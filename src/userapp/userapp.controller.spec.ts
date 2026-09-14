import { Test, TestingModule } from '@nestjs/testing';
import { UserappController } from './userapp.controller.js';
import { UserappService } from './userapp.service.js';

describe('UserappController', () => {
  let controller: UserappController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserappController],
      providers: [UserappService],
    }).compile();

    controller = module.get<UserappController>(UserappController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
