import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TwoFaModule } from '../twofa/twofa.module';

@Module({
  imports: [TwoFaModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}