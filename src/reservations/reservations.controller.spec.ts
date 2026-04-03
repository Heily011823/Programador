import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservations.controller';
import { ReservationService } from './reservations.service';
import { ReadReservationDto } from './dto/read-reservation.dto';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

  const mockReservation = { id: 1, userId: 1, escenarioId: 2, fecha: '2026-04-05', horaInicio: '14:00', horaFin: '15:00', cantidadPersonas: 4, estado: 'activa' } as ReadReservationDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockReservation]),
            findOne: jest.fn().mockResolvedValue(mockReservation),
            create: jest.fn().mockResolvedValue(mockReservation),
            update: jest.fn().mockResolvedValue(mockReservation),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call service.findOne', async () => {
    expect(await controller.show(1)).toEqual(mockReservation);
  });

  it('should call service.remove', async () => {
    await controller.remove({ id: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});