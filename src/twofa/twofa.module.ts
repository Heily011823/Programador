import { Module } from '@nestjs/common';
import { TwoFaService } from './twofa.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule], 
  providers: [TwoFaService],
  exports: [TwoFaService],
})
export class TwoFaModule {}