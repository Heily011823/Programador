import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TwoFaService } from '../twofa/twofa.service';
import { AuthService } from '../auth/auth.service'; 

@Injectable()
export class PaymentsService {
  
  constructor(
    private twoFaService: TwoFaService,
    private authService: AuthService, 
  ) {}

  requestPayment(phone: string) { 
    this.twoFaService.generateCode(phone);
    return { message: 'Código enviado para confirmar pago vía WhatsApp' };
  }

<<<<<<< HEAD
  confirmPayment(phone: string, code: string) {
=======
  
  async confirmPayment(phone: string, code: string) {
>>>>>>> feature/auth-users
    const valid = this.twoFaService.validateCode(phone, code);

    if (!valid) {
      throw new UnauthorizedException('Código de verificación inválido');
    }

   
    const userPayload = { 
      phone: phone, 
      scope: 'payment_verified',
      date: new Date().toISOString() 
    };

   
    const tokenData = await this.authService.login(userPayload);

    return { 
      message: 'Pago realizado con éxito',
      access_token: tokenData.access_token 
    };
  }
}