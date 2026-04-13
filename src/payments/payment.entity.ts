import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  phone!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column()
  codeHash!: string;

  @Column({ type: 'timestamp' })
  expiresAt!: Date;

  @Column({ default: false })
  isConfirmed!: boolean;

  @Column({ default: 0 })
  attempts!: number;

  @ManyToOne(() => User, (user) => user.payments, { eager: false })
  user!: User;
}