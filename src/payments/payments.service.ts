import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TwoFaService } from '../twofa/twofa.service';

@Injectable()
export class PaymentsService {
  constructor(private twoFaService: TwoFaService) {}

  requestPayment(userId: string) {
    this.twoFaService.generateCode(userId);
    return { message: 'Código enviado para confirmar pago' };
  }

  confirmPayment(userId: string, code: string) {
    const valid = this.twoFaService.validateCode(userId, code);

    if (!valid) {
      throw new UnauthorizedException('Código inválido');
    }

    return { message: 'Pago realizado con éxito' };
  }
}