import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Scenario } from './entities/scenario.entity';
import { ScenariosController } from './scenarios.controller';
import { ScenariosService } from './scenarios.service';
import { Sport } from '../sports/entities/sport.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Scenario, Sport]),
  ],
  controllers: [ScenariosController],
  providers: [ScenariosService],
  exports: [ScenariosService],
})
export class ScenariosModule {}