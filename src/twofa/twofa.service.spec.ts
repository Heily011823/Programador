import { Test, TestingModule } from '@nestjs/testing';
import { TwoFaService } from './twofa.service';
import { ConfigService } from '@nestjs/config';

describe('TwoFaService', () => {
  let service: TwoFaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TwoFaService,
       
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'TWILIO_ACCOUNT_SID') return 'AC_test_sid';
              if (key === 'TWILIO_AUTH_TOKEN') return 'test_token';
              if (key === 'TWILIO_PHONE_NUMBER') return '+123456789';
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<TwoFaService>(TwoFaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});