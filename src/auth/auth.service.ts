import { 
  Injectable, 
  UnauthorizedException, 
  BadRequestException, 
  ConflictException 
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TwoFaService } from '../twofa/twofa.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private twoFaService: TwoFaService,
  ) {}

  // --- REGISTRO ---
  async register(phone: string, pass: string, name: string) {
    // 1. Verificamos si el usuario ya existe antes de procesar nada
    const existingUser = await this.usersService.findOneByPhone(phone);
    
    if (existingUser) {
      throw new ConflictException('Este número de teléfono ya está registrado');
    }

    // 2. Si es nuevo, preparamos la seguridad
    const hashedPassword = await bcrypt.hash(pass, 10);
    const code = this.twoFaService.generateCode();

    // 3. Definir expiración (5 minutos)
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    // 4. Enviar el código por SMS/WhatsApp
    // Al estar después del check de existencia, ahorras costos en mensajes fallidos
    await this.twoFaService.sendCode(phone, code);

    // 5. Crear el registro en la base de datos
    const user = await this.usersService.create({
      phone,
      name,
      password: hashedPassword,
      verificationCode: code,
      verificationCodeExpires: expires,
      isVerified: false,
    });

    return {
      message: 'Usuario registrado. Código de verificación enviado.',
      phone: user.phone,
    };
  }

  // --- VERIFICACIÓN DEL CÓDIGO ---
  async verifyPhoneNumber(phone: string, code: string) {
    const user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    // Validar si el código expiró
    if (
      !user.verificationCodeExpires ||
      new Date() > user.verificationCodeExpires
    ) {
      throw new BadRequestException('El código ha expirado.');
    }

    // Validar coincidencia del código
    const isValid = await this.twoFaService.validateCode(
      user.verificationCode!,
      code,
    );

    if (!isValid) {
      throw new BadRequestException('Código de verificación incorrecto.');
    }

    // Marcar como verificado y limpiar los campos de 2FA
    await this.usersService.markAsVerified(user.id);
    await this.usersService.update(user.id, {
      verificationCode: null,
      verificationCodeExpires: null,
    });

    return {
      message: 'Número verificado exitosamente. Ya puedes iniciar sesión.',
    };
  }

  // --- INICIO DE SESIÓN ---
  async login(phone: string, pass: string) {
    const user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Bloquear si el flujo de registro no terminó (verificación pendiente)
    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Debes verificar tu número antes de entrar.',
      );
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      name: user.name,
    };

    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
    };
  }
}