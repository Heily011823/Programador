import { Test, TestingModule } from '@nestjs/testing';
import { SportsService } from './sports.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Sport } from './entities/sport.entity';

describe('SportsService', () => {
  let service: SportsService;

  const mockSportRepository = {
    findOne: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsService,
        {
          provide: getRepositoryToken(Sport),
          useValue: mockSportRepository,
        },
      ],
    }).compile();

    service = module.get<SportsService>(SportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});