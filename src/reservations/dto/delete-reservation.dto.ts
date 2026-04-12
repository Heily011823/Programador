import { IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class DeleteReservationDto {
  @IsNotEmpty({ message: 'El id de la reserva es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El id debe ser un número' })
  @Min(1, { message: 'El id debe ser mayor que 0' })
  id!: number;
}