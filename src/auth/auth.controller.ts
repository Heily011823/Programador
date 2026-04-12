import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: any) {
    const { phone, password, name } = body;

    if (!phone || !password || !name) {
      throw new BadRequestException(
        'Nombre, teléfono y contraseña son obligatorios',
      );
    }

    await this.authService.register(phone, password, name);

    return {
      message: 'Usuario registrado. Código de verificación enviado',
    };
  }

  @Post('verify')
  async verify(@Body() body: any) {
    const { phone, code } = body;

    if (!phone || !code) {
      throw new BadRequestException(
        'Teléfono y código son obligatorios',
      );
    }

    await this.authService.verifyPhoneNumber(phone, code);

    return {
      message: 'Usuario verificado correctamente',
    };
  }

  @Post('login')
  async login(@Body() body: any) {
    const { phone, password } = body;

    if (!phone || !password) {
      throw new BadRequestException(
        'Teléfono y contraseña son obligatorios',
      );
    }

    return await this.authService.login(phone, password);
  }
}