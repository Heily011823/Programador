import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { TwoFaService } from '../twofa/twofa.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private twoFaService: TwoFaService,
  ) {}

  @Post('login')
  async login(@Body() body: { phone: string }) {
    
    const user = await this.authService.validateUser(body.phone);

    if (!user) {
      throw new UnauthorizedException('El número no está registrado en el sistema.');
    }

    
    await this.twoFaService.generateCode(body.phone);
    
    return { 
      message: 'Código de inicio de sesión enviado a WhatsApp',
      userName: user.name 
    };
  }

  @Post('verify')
  async verify(@Body() body: { phone: string; code: string }) {
    
    const isValid = this.twoFaService.validateCode(body.phone, body.code);

    if (!isValid) {
      throw new UnauthorizedException('Código incorrecto o expirado');
    }

    
    const user = await this.authService.validateUser(body.phone);

   
    return this.authService.login(user);
  }
}