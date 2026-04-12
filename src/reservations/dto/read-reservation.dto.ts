import { Reservation } from '../reservations.entity';

export class ReadReservationDto {
  id: number;
  userId: number | null;
  scenarioId: number;
  date: string;
  startTime: string;
  endTime: string;
  peopleCount: number;
  status: string;

  constructor(reservation: Reservation) {
    this.id = reservation.id;
    this.userId = reservation.user?.id ?? null;
    this.scenarioId = reservation.scenarioId;
    this.date = reservation.date;
    this.startTime = reservation.startTime;
    this.endTime = reservation.endTime;
    this.peopleCount = reservation.peopleCount;
    this.status = reservation.status;
  }
}