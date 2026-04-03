import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { BadRequestException } from '@nestjs/common';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: {
            requestPayment: jest.fn(),
            confirmPayment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
  });

  it('debería estar definido', () => {
    expect(controller).toBeDefined();
  });

  // Solicitar pago (envía código)
  it('debería solicitar un pago y enviar código', async () => {
    const dto = { phone: '123', amount: 100 };

    (service.requestPayment as jest.Mock).mockResolvedValue({
      message: 'Código enviado para confirmar el pago',
    });

    const result = await controller.requestPayment(dto);

    expect(service.requestPayment).toHaveBeenCalledWith(
      dto.phone,
      dto.amount,
    );

    expect(result).toEqual({
      message: 'Código enviado para confirmar el pago',
    });
  });

  //  Error por datos faltantes
  it('debería lanzar error si faltan datos', async () => {
    await expect(controller.requestPayment({})).rejects.toThrow(
      new BadRequestException('Teléfono y monto son obligatorios'),
    );
  });

  //  Confirmar pago
  it('debería confirmar el pago con código correcto', async () => {
    const dto = { phone: '123', code: '123456' };

    (service.confirmPayment as jest.Mock).mockResolvedValue({
      message: 'Pago realizado con éxito',
    });

    const result = await controller.confirmPayment(dto);

    expect(service.confirmPayment).toHaveBeenCalledWith(
      dto.phone,
      dto.code,
    );

    expect(result).toEqual({
      message: 'Pago realizado con éxito',
    });
  });

  //  Error por datos faltantes en confirmación
  it('debería lanzar error si faltan datos en confirmación', async () => {
    await expect(controller.confirmPayment({})).rejects.toThrow(
      new BadRequestException('Teléfono y código son obligatorios'),
    );
  });
});