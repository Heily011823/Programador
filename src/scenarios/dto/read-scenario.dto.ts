import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { ScenarioStatus } from '../enums/scenario-status.enum';

export class QueryScenarioDto {
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El id del deporte debe ser un número entero' })
  @Min(1, { message: 'El id del deporte debe ser mayor a 0' })
  sportId?: number;

  @IsOptional()
  @IsEnum(ScenarioStatus, { message: 'El estado no es válido' })
  status?: ScenarioStatus;


  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'El limite debe ser un número entero' })
  @Min(1, { message: 'El limite debe ser mínimo 1' })
  @Max(50, { message: 'El limite no puede ser mayor a 50' })
  limit?: number = 10;
}