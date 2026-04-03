import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './reservations.entity';
import { Repository } from 'typeorm';
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

  // Obtener todas las reservas
  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find();
  }

  // Obtener una reserva por id
  async findOne(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con id ${id} no encontrada`);
    }
    return reservation;
  }

  // Crear una nueva reserva
  async create(dto: CreateReservationDto): Promise<Reservation> {
    // Validar que el usuario exista
    const user = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`Usuario con id ${dto.userId} no encontrado`);
    }

    // Crear la reserva
    const reservation = this.reservationRepository.create({
      user, // TypeScript sabe que no es undefined
      escenarioId: dto.escenarioId,
      fecha: dto.fecha,
      horaInicio: dto.horaInicio,
      horaFin: dto.horaFin,
      cantidadPersonas: dto.cantidadPersonas,
    });

    return this.reservationRepository.save(reservation);
  }

  // Actualizar una reserva existente
  async update(id: number, dto: UpdateReservationDto): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con id ${id} no encontrada`);
    }

    Object.assign(reservation, dto);

    return this.reservationRepository.save(reservation);
  }

  // Eliminar una reserva
  async remove(id: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con id ${id} no encontrada`);
    }

    await this.reservationRepository.remove(reservation);
  }
}