import { Type } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryReservationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El id del escenario debe ser un número entero' })
  @Min(1, { message: 'El id del escenario debe ser mayor a 0' })
  scenarioId?: number;
}