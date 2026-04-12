import {Controller, Get, Post, Put, Delete,Param, Body,ParseIntPipe,} from '@nestjs/common';

import { ReservationService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReadReservationDto } from './dto/read-reservation.dto';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  async findAll(): Promise<ReadReservationDto[]> {
    const reservations = await this.reservationService.findAll();
    return reservations.map(r => new ReadReservationDto(r));
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const reservation = await this.reservationService.findOne(id);
    return new ReadReservationDto(reservation);
  }

  @Post()
  async create(@Body() dto: CreateReservationDto) {
    const reservation = await this.reservationService.create(dto);
    return new ReadReservationDto(reservation);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateReservationDto,
  ) {
    const reservation = await this.reservationService.update(id, dto);
    return new ReadReservationDto(reservation);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.reservationService.remove(id);
  }
}