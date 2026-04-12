import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { TwoFaService } from '../twofa/twofa.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly twoFaService: TwoFaService,
  ) {}

  async register(phone: string, pass: string, name: string) {
    const existingUser = await this.usersService.findOneByPhone(phone);

    if (existingUser) {
      throw new ConflictException('Este número de teléfono ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(pass, 10);
    const code = this.twoFaService.generateCode();

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    await this.twoFaService.sendCode(phone, code);

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

  async verifyPhoneNumber(phone: string, code: string) {
    const user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      throw new BadRequestException('Usuario no encontrado.');
    }

    if (
      !user.verificationCodeExpires ||
      new Date() > user.verificationCodeExpires
    ) {
      throw new BadRequestException('El código ha expirado.');
    }

    const isValid = await this.twoFaService.validateCode(
      user.verificationCode,
      code,
    );

    if (!isValid) {
      throw new BadRequestException('Código de verificación incorrecto.');
    }

    await this.usersService.markAsVerified(user.id);
    await this.usersService.update(user.id, {
      verificationCode: null,
      verificationCodeExpires: null,
    });

    return {
      message: 'Número verificado exitosamente. Ya puedes iniciar sesión.',
    };
  }

  async login(phone: string, pass: string) {
    const user = await this.usersService.findOneByPhone(phone);

    if (!user) {
      throw new UnauthorizedException('Credenciales incorrectas.');
    }

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