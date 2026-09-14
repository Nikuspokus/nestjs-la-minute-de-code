import { Test, TestingModule } from '@nestjs/testing';
import { UserappService } from './userapp.service.js';

describe('UserappService', () => {
  let service: UserappService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserappService],
    }).compile();

    service = module.get<UserappService>(UserappService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
