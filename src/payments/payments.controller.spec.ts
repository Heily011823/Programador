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

  it('debería solicitar un pago y enviar código', async () => {
    const req = { user: { id: 1, phone: '123' } };
    const body = { amount: 100 };

    (service.requestPayment as jest.Mock).mockResolvedValue({
      message: 'Código enviado para confirmar el pago',
    });

    const result = await controller.request(req, body);

    expect(service.requestPayment).toHaveBeenCalledWith(req.user, body.amount);
    expect(result).toEqual({
      message: 'Código enviado para confirmar el pago',
    });
  });

  it('debería lanzar error si falta el monto', async () => {
    const req = { user: { id: 1, phone: '123' } };

    await expect(controller.request(req, {} as any)).rejects.toThrow(
      new BadRequestException('El monto es obligatorio'),
    );
  });

  it('debería confirmar el pago con código correcto', async () => {
    const req = { user: { id: 1, phone: '123' } };
    const body = { code: '123456' };

    (service.confirmPayment as jest.Mock).mockResolvedValue({
      message: 'Pago realizado con éxito',
    });

    const result = await controller.confirm(req, body);

    expect(service.confirmPayment).toHaveBeenCalledWith(req.user, body.code);
    expect(result).toEqual({
      message: 'Pago realizado con éxito',
    });
  });

  it('debería lanzar error si falta el código', async () => {
    const req = { user: { id: 1, phone: '123' } };

    await expect(controller.confirm(req, {} as any)).rejects.toThrow(
      new BadRequestException('El código es obligatorio'),
    );
  });
});