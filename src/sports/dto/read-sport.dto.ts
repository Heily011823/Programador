import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QuerySportDto {
  @IsOptional()
  @IsString({ message: 'El filtro name debe ser texto' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'page debe ser un número entero' })
  @Min(1, { message: 'page debe ser mínimo 1' })
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'limit debe ser un número entero' })
  @Min(1, { message: 'limit debe ser mínimo 1' })
  @Max(50, { message: 'limit no puede ser mayor a 50' })
  limit?: number = 10;
}