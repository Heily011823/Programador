import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
<<<<<<< HEAD
import { TwoFaModule } from '../twofa/twofa.module'; 

@Module({
  imports: [TwoFaModule], 
=======
import { TwoFaModule } from '../twofa/twofa.module';
import { AuthModule } from '../auth/auth.module'; 

@Module({
  imports: [
    TwoFaModule, 
    AuthModule 
  ],
>>>>>>> feature/auth-users
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}