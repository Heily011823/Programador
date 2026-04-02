import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TwoFaService } from '../twofa/twofa.service';

@Injectable()
export class PaymentsService {
  constructor(private twoFaService: TwoFaService) {}

  requestPayment(phone: string) { 
    this.twoFaService.generateCode(phone);
    return { message: 'Código enviado para confirmar pago vía WhatsApp' };
  }

  confirmPayment(phone: string, code: string) {
    const valid = this.twoFaService.validateCode(phone, code);

    if (!valid) {
      throw new UnauthorizedException('Código de verificación inválido');
    }

    return { message: 'Pago realizado con éxito' };
  }
}