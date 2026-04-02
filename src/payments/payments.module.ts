import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { TwoFaModule } from '../twofa/twofa.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TwoFaModule, 
    AuthModule 
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}