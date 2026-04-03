import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { DeleteReservationDto } from './dto/delete-reservation.dto';
import { ReadReservationDto } from './dto/read-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Listar todas las reservas
  @Get()
  async index(): Promise<ReadReservationDto[]> {
    const reservations = await this.reservationService.findAll();
    return reservations.map(r => new ReadReservationDto(r));
  }

  // Mostrar una reserva por ID
  @Get(':id')
  async show(@Param('id') id: number): Promise<ReadReservationDto> {
    const reservation = await this.reservationService.findOne(id);
    return new ReadReservationDto(reservation);
  }

  // Crear una nueva reserva
  @Post()
  async create(@Body() dto: CreateReservationDto): Promise<ReadReservationDto> {
    const reservation = await this.reservationService.create(dto);
    return new ReadReservationDto(reservation);
  }

  // Actualizar una reserva existente
  @Put(':id')
  async update(@Param('id') id: number, @Body() dto: UpdateReservationDto): Promise<ReadReservationDto> {
    const reservation = await this.reservationService.update(id, dto);
    return new ReadReservationDto(reservation);
  }

  // Eliminar una reserva
  @Delete()
  async remove(@Body() dto: DeleteReservationDto): Promise<void> {
    return this.reservationService.remove(dto.id);
  }
}