import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El id del usuario debe ser un número' })
  userId!: number;

  @IsNotEmpty({ message: 'El escenario es obligatorio' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El id del escenario debe ser un número' })
  scenarioId!: number;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsString({ message: 'La fecha debe ser una cadena de texto' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD',
  })
  date!: string;

  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La horaInicio debe tener formato HH:MM',
  })
  startTime!: string;

  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La horaFin debe tener formato HH:MM',
  })
  endTime!: string;

  @IsNotEmpty({ message: 'La cantidad de personas es obligatoria' })
  @Type(() => Number)
  @IsNumber({}, { message: 'La cantidad de personas debe ser un número' })
  @Min(1, { message: 'Debe haber al menos 1 persona' })
  peopleCount!: number;
}