import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Payment } from '../payments/payment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' }) 
  name!: string;

  @Column({ type: 'varchar', unique: true })
  phone!: string;

  @Column({ type: 'varchar' })
  password!: string;

 
  @Column({ type: 'varchar', nullable: true })
  verificationCode?: string | null; 

  
  @Column({ type: 'timestamp', nullable: true })
  verificationCodeExpires?: Date | null; 

  @Column({ default: false })
  isVerified!: boolean;

  @OneToMany(() => Payment, (payment) => payment.user)
  payments!: Payment[];

  @CreateDateColumn()
  createdAt!: Date;
}