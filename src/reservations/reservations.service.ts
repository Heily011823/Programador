import {Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';

import { Reservation } from './reservations.entity';
import { User } from '../users/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });

    if (!reservation) {
      throw new NotFoundException('Reserva no encontrada');
    }

    return reservation;
  }

  async create(dto: CreateReservationDto): Promise<Reservation> {
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (dto.endTime <= dto.startTime) {
      throw new BadRequestException('La hora fin debe ser mayor a la hora inicio');
    }

    const overlap = await this.reservationRepository.findOne({
      where: {
        scenarioId: dto.scenarioId,
        date: dto.date,
        startTime: LessThan(dto.endTime),
        endTime: MoreThan(dto.startTime),
      },
    });

    if (overlap) {
      throw new BadRequestException('Ya existe una reserva en ese horario');
    }

    const reservation = this.reservationRepository.create({
      user,
      scenarioId: dto.scenarioId,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      peopleCount: dto.peopleCount,
    });

    return this.reservationRepository.save(reservation);
  }

  async update(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.findOne(id);

    const startTime = dto.startTime ?? reservation.startTime;
    const endTime = dto.endTime ?? reservation.endTime;
    const date = dto.date ?? reservation.date;
    const scenarioId = dto.scenarioId ?? reservation.scenarioId;

    if (endTime <= startTime) {
      throw new BadRequestException('La hora fin debe ser mayor a la hora inicio');
    }

    const overlap = await this.reservationRepository.findOne({
      where: {
        scenarioId,
        date,
        startTime: LessThan(endTime),
        endTime: MoreThan(startTime),
      },
    });

    if (overlap && overlap.id !== id) {
      throw new BadRequestException('Conflicto de horario');
    }

    if (dto.userId) {
      const user = await this.userRepository.findOne({ where: { id: dto.userId } });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      reservation.user = user;
    }

    Object.assign(reservation, dto);

    return this.reservationRepository.save(reservation);
  }

  async remove(id: number): Promise<void> {
    const result = await this.reservationRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Reserva no encontrada');
    }
  }
}