import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { VerifyPhoneDto } from './dto/verify-phone.dto';
import { TwilioService } from './twilio.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
  ) {}

  async register(data: RegisterDto) {
    const existingUser = await this.usersService.findByPhoneWithPassword(data.phone);

    if (existingUser) {
      throw new BadRequestException('El número ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    const user = await this.usersService.create({
      name: data.name,
      phone: data.phone,
      password: hashedPassword,
      isVerified: false,
      verificationCode,
      role: UserRole.CLIENT,
    });

    await this.twilioService.sendVerificationCode(user.phone, verificationCode);

    return {
      message:
        'Usuario registrado. Se envió un código de verificación por WhatsApp.',
      phone: user.phone,
    };
  }

  async verifyPhone(data: VerifyPhoneDto) {
    const user = await this.usersService.findByPhoneWithPassword(data.phone);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    if (user.isVerified) {
      throw new BadRequestException('El número ya fue verificado');
    }

    if (user.verificationCode !== data.code) {
      throw new BadRequestException('Código inválido');
    }

    await this.usersService.update(user.id, {
      isVerified: true,
      verificationCode: null,
    });

    return {
      message: 'Número verificado correctamente',
    };
  }

  async login(data: LoginDto) {
    const user = await this.usersService.findByPhoneWithPassword(data.phone);

    if (!user) {
      throw new UnauthorizedException('Usuario no existe');
    }

    const isMatch = await bcrypt.compare(data.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(
        'Debes verificar tu número antes de iniciar sesión',
      );
    }

    const payload = {
      sub: user.id,
      phone: user.phone,
      role: user.role,
    };

    console.log('PAYLOAD QUE SE FIRMA:', payload);

    const token = this.jwtService.sign(payload);

    console.log('TOKEN GENERADO:', token);

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  }
}