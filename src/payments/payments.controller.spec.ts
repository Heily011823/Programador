import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
       
        {
          provide: PaymentsService,
          useValue: {
            requestPayment: jest.fn().mockResolvedValue({ message: 'Código enviado' }),
            confirmPayment: jest.fn().mockResolvedValue({ 
              message: 'Pago realizado con éxito', 
              access_token: 'token_falso' 
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});