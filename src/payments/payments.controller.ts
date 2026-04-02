import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('request')
<<<<<<< HEAD
  request(@Body() body: { phone: string }) {
=======
  async request(@Body() body: { phone: string }) {
  
    if (!body.phone) {
      throw new BadRequestException('El número de teléfono es obligatorio');
    }
    
>>>>>>> feature/auth-users
    return this.paymentsService.requestPayment(body.phone);
  }

  @Post('confirm')
<<<<<<< HEAD
  confirm(@Body() body: { phone: string; code: string }) {
    return this.paymentsService.confirmPayment(body.phone, body.code);
=======
  async confirm(@Body() body: { phone: string; code: string }) {
    
    if (!body.phone || !body.code) {
      throw new BadRequestException('Teléfono y código son obligatorios');
    }

    return await this.paymentsService.confirmPayment(body.phone, body.code);
>>>>>>> feature/auth-users
  }
}