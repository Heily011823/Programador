import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('request')
 
  request(@Body() body: { phone: string }) {
   
    return this.paymentsService.requestPayment(body.phone);
  }

  @Post('confirm')
 
  confirm(@Body() body: { phone: string; code: string }) {
    return this.paymentsService.confirmPayment(body.phone, body.code);
  }
}