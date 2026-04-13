import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ScenariosService } from './scenarios.service';
import { Scenario } from './entities/scenario.entity';
import { Sport } from '../sports/entities/sport.entity';

describe('ScenariosService', () => {
  let service: ScenariosService;

  const mockScenarioRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockSportRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScenariosService,
        {
          provide: getRepositoryToken(Scenario),
          useValue: mockScenarioRepository,
        },
        {
          provide: getRepositoryToken(Sport),
          useValue: mockSportRepository,
        },
      ],
    }).compile();

    service = module.get<ScenariosService>(ScenariosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});