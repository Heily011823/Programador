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
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './payment.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]), 
    TwoFaModule,
    AuthModule,
    UsersModule,
  ],
>>>>>>> feature/auth-users
  providers: [PaymentsService],
  controllers: [PaymentsController],
  exports: [PaymentsService],
})
export class PaymentsModule {}