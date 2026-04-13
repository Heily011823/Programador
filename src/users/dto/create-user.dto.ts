import {
  IsNotEmpty,
  IsString,
  Matches,
  Length,
  MinLength,
  IsOptional,
  IsDate,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser un texto válido' })
  @Length(3, 50, { message: 'El nombre debe tener entre 3 y 50 caracteres' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  name!: string;

  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @Matches(/^\+57\d{10}$/, {
    message: 'El teléfono debe empezar con +57 seguido de 10 números',
  })
  phone!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password!: string;

  @IsOptional()
  @IsString()
  verificationCode?: string;

  @IsOptional()
  @IsDate()
  verificationCodeExpires?: Date;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsEnum(UserRole, { message: 'El rol debe ser admin o client' })
  role?: UserRole;
}