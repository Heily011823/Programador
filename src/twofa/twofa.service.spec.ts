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

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  
  it('debería generar un código de 6 dígitos', () => {
    const code = service.generateCode();

    expect(code).toHaveLength(6);
    expect(Number(code)).toBeGreaterThanOrEqual(0);
  });

  
  it('debería validar correctamente un código', async () => {
    const result = await service.validateCode('123456', '123456');

    expect(result).toBe(true);
  });

  
  it('debería rechazar un código incorrecto', async () => {
    const result = await service.validateCode('123456', '000000');

    expect(result).toBe(false);
  });

  
  it('debería intentar enviar un código', async () => {
    const result = await service.sendCode('123456789', '123456');

    expect(result).toBeDefined();
  });
});