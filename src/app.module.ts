import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PaymentsModule } from './payments/payments.module';
import { TwofaModule } from './twofa/twofa.module';

@Module({
  imports: [AuthModule, UsersModule, PaymentsModule, TwofaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
