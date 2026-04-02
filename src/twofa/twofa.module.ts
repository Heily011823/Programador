import { Module } from '@nestjs/common';
import { TwoFaService } from './twofa.service';

@Module({
  providers: [TwoFaService],
  exports: [TwoFaService], 
})
export class TwoFaModule {}