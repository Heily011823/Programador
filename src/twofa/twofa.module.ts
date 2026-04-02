import { Module } from '@nestjs/common';
import { TwofaService } from './twofa.service';

@Module({
  providers: [TwofaService]
})
export class TwofaModule {}
