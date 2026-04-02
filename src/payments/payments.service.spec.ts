import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { TwoFaService } from '../twofa/twofa.service';
import { AuthService } from '../auth/auth.service';

describe('PaymentsService', () => {
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        
        {
          provide: TwoFaService,
          useValue: {
            generateCode: jest.fn(),
            validateCode: jest.fn(),
          },
        },
        
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});