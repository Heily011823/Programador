import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { TwoFaService } from '../twofa/twofa.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepo: Repository<Payment>,
    private twoFaService: TwoFaService,
  ) {}

  async requestPayment(user: any, amount: number) {
    if (amount === undefined || amount === null || amount <= 0) {
      throw new BadRequestException('El monto debe ser mayor que 0');
    }

    const code = this.twoFaService.generateCode();
    const codeHash = await bcrypt.hash(code, 10);

    const expires = new Date();
    expires.setMinutes(expires.getMinutes() + 5);

    const payment = this.paymentRepo.create({
      phone: user.phone,
      amount,
      codeHash,
      expiresAt: expires,
      isConfirmed: false,
      attempts: 0,
      user,
    });

    await this.paymentRepo.save(payment);
    await this.twoFaService.sendCode(user.phone, code);

    return {
      message: 'Código enviado para confirmar el pago',
    };
  }

  async confirmPayment(user: any, code: string) {
    const payment = await this.paymentRepo.findOne({
      where: {
        phone: user.phone,
        isConfirmed: false,
      },
      order: { id: 'DESC' },
      relations: ['user'],
    });

    if (!payment) {
      throw new BadRequestException('No hay pago pendiente');
    }

    if (new Date() > payment.expiresAt) {
      throw new BadRequestException('El código ha expirado');
    }

    if (payment.attempts >= 3) {
      throw new BadRequestException(
        'Demasiados intentos fallidos. Solicita un nuevo código',
      );
    }

    const isValid = await bcrypt.compare(code, payment.codeHash);

    if (!isValid) {
      payment.attempts += 1;
      await this.paymentRepo.save(payment);
      throw new BadRequestException('Código inválido');
    }

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