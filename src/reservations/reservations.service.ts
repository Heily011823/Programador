import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Scenario } from '../scenarios/entities/scenario.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { QueryReservationDto } from './dto/read-reservation.dto';
import { ReservationStatus } from './enums/reservation-status.enum';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Scenario)
    private readonly scenarioRepository: Repository<Scenario>,
  ) {}

  private calculateHours(startTime: string, endTime: string): number {
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);

    return endHour - startHour;
  }

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const scenario = await this.scenarioRepository.findOne({
      where: { id: dto.scenarioId },
    });

    if (!scenario) {
      throw new NotFoundException(
        `No existe un escenario con id ${dto.scenarioId}`,
      );
    }

    if (dto.peopleCount > scenario.capacity) {
      throw new BadRequestException(
        'La cantidad de personas excede la capacidad del escenario',
      );
    }

    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException(
        'La hora de inicio debe ser menor que la hora final',
      );
    }

    const existingReservations = await this.reservationRepository.find({
      where: {
        scenario: { id: dto.scenarioId },
        date: dto.date,
        status: ReservationStatus.ACTIVE,
      },
      relations: ['scenario'],
    });

    const overlap = existingReservations.find((reservation) => {
      return (
        dto.startTime < reservation.endTime &&
        dto.endTime > reservation.startTime
      );
    });

    if (overlap) {
      throw new BadRequestException(
        'Ya existe una reserva en ese horario para este escenario',
      );
    }

    const hours = this.calculateHours(dto.startTime, dto.endTime);

    if (hours <= 0) {
      throw new BadRequestException('El rango horario no es válido');
    }

    const totalPrice = hours * Number(scenario.price);

    const reservation = this.reservationRepository.create({
      scenario,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      peopleCount: dto.peopleCount,
      totalPrice,
      status: ReservationStatus.ACTIVE,
    });

    return await this.reservationRepository.save(reservation);
  }

  async findAll(query: QueryReservationDto): Promise<Reservation[]> {
    const where: any = {};

    if (query.scenarioId) {
      where.scenario = { id: query.scenarioId };
    }

    return await this.reservationRepository.find({
      where,
      order: { id: 'ASC' },
      relations: ['scenario'],
    });
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id },
      relations: ['scenario'],
    });

    if (!reservation) {
      throw new NotFoundException(`No existe una reserva con id ${id}`);
    }

    return reservation;
  }

  async update(
    id: number,
    dto: UpdateReservationDto,
  ): Promise<Reservation> {
    const reservation = await this.findOne(id);

    if (dto.scenarioId !== undefined) {
      const scenario = await this.scenarioRepository.findOne({
        where: { id: dto.scenarioId },
      });

      if (!scenario) {
        throw new NotFoundException(
          `No existe un escenario con id ${dto.scenarioId}`,
        );
      }

      reservation.scenario = scenario;
    }

    if (dto.date !== undefined) {
      reservation.date = dto.date;
    }

    if (dto.startTime !== undefined) {
      reservation.startTime = dto.startTime;
    }

    if (dto.endTime !== undefined) {
      reservation.endTime = dto.endTime;
    }

    if (dto.peopleCount !== undefined) {
      reservation.peopleCount = dto.peopleCount;
    }

    if (reservation.peopleCount > reservation.scenario.capacity) {
      throw new BadRequestException(
        'La cantidad de personas excede la capacidad del escenario',
      );
    }

    if (reservation.startTime >= reservation.endTime) {
      throw new BadRequestException(
        'La hora de inicio debe ser menor que la hora final',
      );
    }

    const hours = this.calculateHours(
      reservation.startTime,
      reservation.endTime,
    );

    if (hours <= 0) {
      throw new BadRequestException('El rango horario no es válido');
    }

    reservation.totalPrice = hours * Number(reservation.scenario.price);

    return await this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<{ message: string }> {
    const reservation = await this.findOne(id);

    await this.reservationRepository.remove(reservation);

    return {
      message: `Reserva con id ${id} eliminada correctamente`,
    };
  }
}