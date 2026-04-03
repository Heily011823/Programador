import { Reservation } from '../reservations.entity';

export class ReadReservationDto {
  id: number;
  userId: number;
  escenarioId: number;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  cantidadPersonas: number;
  estado: string;

  constructor(reservation: Reservation) {
    this.id = reservation.id;
    this.userId = reservation.user.id; // solo el ID del usuario
    this.escenarioId = reservation.escenarioId;
    this.fecha = reservation.fecha;
    this.horaInicio = reservation.horaInicio;
    this.horaFin = reservation.horaFin;
    this.cantidadPersonas = reservation.cantidadPersonas;
    this.estado = reservation.estado;
  }
}