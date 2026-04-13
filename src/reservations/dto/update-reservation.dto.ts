import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  scenarioId?: number;
  date?: string;
  startTime?: string;
  endTime?: string;
  peopleCount?: number;
}