import { IsNotEmpty, IsString, Matches, Length } from 'class-validator';

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
    message: 'El teléfono debe empezar con +57 seguido de 10 números (ej: +573244634115)',
  })
  phone!: string; 
}