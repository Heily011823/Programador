import { Test, TestingModule } from '@nestjs/testing';
import { SportsController } from './sports.controller';
import { SportsService } from './sports.service';

describe('SportsController', () => {
  let controller: SportsController;

  const mockSportsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SportsController],
      providers: [
        {
          provide: SportsService,
          useValue: mockSportsService,
        },
      ],
    }).compile();

    controller = module.get<SportsController>(SportsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});