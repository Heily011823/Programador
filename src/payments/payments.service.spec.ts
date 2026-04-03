import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { TwoFaService } from '../twofa/twofa.service';
import { BadRequestException } from '@nestjs/common';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let twoFaService: TwoFaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: TwoFaService,
          useValue: {
            generateCode: jest.fn(),
            sendCode: jest.fn(),
            validateCode: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    twoFaService = module.get<TwoFaService>(TwoFaService);
  });

  it('debería estar definido', () => {
    expect(service).toBeDefined();
  });

  //  Solicitar pago (genera y envía código)
  it('debería generar y enviar código OTP para pago', async () => {
    (twoFaService.generateCode as jest.Mock).mockReturnValue('123456');
    (twoFaService.sendCode as jest.Mock).mockResolvedValue(true);

    const result = await service.requestPayment('123', 100);

    expect(twoFaService.generateCode).toHaveBeenCalled();
    expect(twoFaService.sendCode).toHaveBeenCalledWith('123', '123456');

    expect(result).toEqual({
      message: 'Código enviado para confirmar el pago',
    });
  });

  // Confirmar pago exitoso
  it('debería confirmar el pago con código válido', async () => {
    (twoFaService.validateCode as jest.Mock).mockResolvedValue(true);

    const result = await service.confirmPayment('123', '123456');

    expect(twoFaService.validateCode).toHaveBeenCalled();

    expect(result).toEqual({
      message: 'Pago realizado con éxito',
    });
  });

  // Código inválido
  it('debería fallar si el código es incorrecto', async () => {
    (twoFaService.validateCode as jest.Mock).mockResolvedValue(false);

    await expect(
      service.confirmPayment('123', '000000'),
    ).rejects.toThrow(
      new BadRequestException('Código inválido o expirado'),
    );
  });
});