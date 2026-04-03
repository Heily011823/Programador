import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteReservationDto {
  @IsNotEmpty({ message: 'El id de la reserva es obligatorio' })
  @IsNumber({}, { message: 'El id debe ser un número' })
  id!: number;
}