import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './reservations.entity';
import { ReservationService } from './reservations.service';
import { ReservationController } from './reservations.controller';
import { User } from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}