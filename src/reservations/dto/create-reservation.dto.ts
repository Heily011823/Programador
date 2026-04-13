import {IsDateString, IsInt, IsNotEmpty, IsString, Min,} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @Type(() => Number)
  @IsInt({ message: 'El id del escenario debe ser un número entero' })
  @Min(1)
  scenarioId: number;

  @IsDateString({}, { message: 'La fecha debe ser válida' })
  date: string;

  @IsString()
  @IsNotEmpty()
  startTime: string;

  @IsString()
  @IsNotEmpty()
  endTime: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  peopleCount: number;
}