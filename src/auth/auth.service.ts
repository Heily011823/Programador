import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
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

  // REGISTRO
  async register(phone: string, pass: string, name: string) {
    const hashedPassword = await bcrypt.hash(pass, 10);

    // Generar código
    const code = this.twoFaService.generateCode();

    //  Expira en 5 minutos
    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    // Enviar código
    await this.twoFaService.sendCode(phone, code);

    // Crear usuario
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

  // VERIFICACIÓN
  async verifyPhoneNumber(phone: string, code: string) {
    const user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    //  Validar expiración
    if (
      !user.verificationCodeExpires ||
      new Date() > user.verificationCodeExpires
    ) {
      throw new BadRequestException('El código ha expirado.');
    }

    // Validar código con servicio 2FA
    const isValid = await this.twoFaService.validateCode(
      user.verificationCode!,
      code,
    );

    if (!isValid) {
      throw new BadRequestException('Código de verificación incorrecto.');
    }

    // Marcar como verificado
    await this.usersService.markAsVerified(user.id);

    // Limpiar código (importante)
    await this.usersService.update(user.id, {
      verificationCode: null,
      verificationCodeExpires: null,
    });

    return {
      message: 'Número verificado exitosamente. Ya puedes iniciar sesión.',
    };
  }

  // LOGIN
  async login(phone: string, pass: string) {
    const user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

    // Bloquear si no está verificado
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