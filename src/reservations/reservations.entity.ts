import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('reservations')
export class Reservation {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @Column()
  escenarioId: number;

  @Column()
  fecha: string;

  @Column()
  horaInicio: string;

  @Column()
  horaFin: string;

  @Column()
  cantidadPersonas: number;

  @Column({ default: 'activa' })
  estado: string;
}