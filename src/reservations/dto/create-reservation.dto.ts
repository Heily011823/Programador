import { IsNotEmpty, IsNumber, IsString, Matches, Min } from 'class-validator';

export class CreateReservationDto {

  @IsNotEmpty({ message: 'El usuario es obligatorio' })
  @IsNumber({}, { message: 'El id del usuario debe ser un número' })
  userId!: number;

  @IsNotEmpty({ message: 'El escenario es obligatorio' })
  @IsNumber({}, { message: 'El id del escenario debe ser un número' })
  escenarioId!: number;

  @IsNotEmpty({ message: 'La fecha es obligatoria' })
  @IsString({ message: 'La fecha debe ser una cadena de texto' })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'La fecha debe tener formato YYYY-MM-DD',
  })
  fecha!: string;

  @IsNotEmpty({ message: 'La hora de inicio es obligatoria' })
  @IsString({ message: 'La horaInicio debe ser una cadena de texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La horaInicio debe tener formato HH:MM (24h)',
  })
  horaInicio!: string;

  @IsNotEmpty({ message: 'La hora de fin es obligatoria' })
  @IsString({ message: 'La horaFin debe ser una cadena de texto texto' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'La horaFin debe tener formato HH:MM (24h)',
  })
  horaFin!: string;

  @IsNotEmpty({ message: 'La cantidad de personas es obligatoria' })
  @IsNumber({}, { message: 'Debe ser un número' })
  @Min(1, { message: 'Debe haber al menos 1 persona' })
  cantidadPersonas!: number;
}