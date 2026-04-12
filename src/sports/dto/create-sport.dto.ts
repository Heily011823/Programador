import { IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min,} from 'class-validator';

export class CreateSportDto {
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name: string;

  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(255, { message: 'La descripción no puede tener más de 255 caracteres' })
  description?: string;

  @IsOptional()
  @IsInt({ message: 'maxPlayers debe ser un número entero' })
  @Min(1, { message: 'maxPlayers debe ser mayor a 0' })
  maxPlayers?: number;
}