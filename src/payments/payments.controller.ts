import { Controller, Post, Body, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  // SOLO USUARIOS AUTENTICADOS
  @UseGuards(AuthGuard('jwt'))
  @Post('request')
  async request(
    @Request() req,
    @Body() body: { amount: number }
  ) {
    const { amount } = body;
    const user = req.user;

    if (!amount) {
      throw new BadRequestException('El monto es obligatorio');
    }

    return this.paymentsService.requestPayment(user.phone, amount);
  }

  //  SOLO AUTENTICADOS
  @UseGuards(AuthGuard('jwt'))
  @Post('confirm')
  async confirm(
    @Request() req,
    @Body() body: { code: string }
  ) {
    const { code } = body;
    const user = req.user;

    if (!code) {
      throw new BadRequestException('El código es obligatorio');
    }

    return this.paymentsService.confirmPayment(user.phone, code);
  }
}