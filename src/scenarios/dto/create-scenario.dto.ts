import {IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, MaxLength, Min, } from 'class-validator';
import { Type } from 'class-transformer';
import { ScenarioStatus } from '../enums/scenario-status.enum';

export class CreateScenarioDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;


  @IsString({ message: 'La ubicación debe ser una cadena texto' })
  @IsNotEmpty({ message: 'La ubicación es obligatoria' })
  @MaxLength(150, {
    message: 'La ubicación no puede tener más de 150 caracteres',
  })
  location: string;

  @Type(() => Number)
  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @Min(1, { message: 'La capacidad debe ser mayor a 0' })
  capacity: number;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @IsOptional()
  @IsEnum(ScenarioStatus, { message: 'El estado no es válido' })
  status?: ScenarioStatus;

  @Type(() => Number)
  @IsInt({ message: 'El id del deporte debe ser un número entero' })
  @Min(1, { message: 'El id del deporte debe ser mayor a 0' })
  sportId: number;
}