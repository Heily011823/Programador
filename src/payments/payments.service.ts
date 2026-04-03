import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { TwoFaService } from '../twofa/twofa.service';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private twoFaService: TwoFaService,
  ) {}

  //  Solicitar pago
  async requestPayment(phone: string, amount: number) {
    const code = this.twoFaService.generateCode();

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    const payment = this.paymentRepo.create({
      phone,
      amount,
      code,
      expiresAt: expires,
      isConfirmed: false,
    });

    await this.paymentRepo.save(payment);

    await this.twoFaService.sendCode(phone, code);

    return {
      message: 'Código enviado para confirmar el pago',
    };
  }

  //  Confirmar pago
  async confirmPayment(phone: string, code: string) {
    const payment = await this.paymentRepo.findOne({
      where: { phone, isConfirmed: false },
      order: { id: 'DESC' }, // último pago
    });

    if (!payment) {
      throw new BadRequestException('No hay pago pendiente');
    }

    // validar expiración
    if (new Date() > payment.expiresAt) {
      throw new BadRequestException('El código ha expirado');
    }

    const isValid = await this.twoFaService.validateCode(
      payment.code,
      code,
    );

    if (!isValid) {
      throw new BadRequestException('Código inválido o expirado');
    }

    // confirmar pago
    payment.isConfirmed = true;
    await this.paymentRepo.save(payment);

    return {
      message: 'Pago realizado con éxito',
      transactionId: payment.id,
      amount: payment.amount,
      phone: payment.phone,
    };
  }
}