import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number; 

  @Column()
  name!: string;

  @Column({ unique: true })
  phone!: string; 

  @Column()
  password!: string; 

  @Column({ nullable: true })
  verificationCode?: string; 

  @Column({ type: 'timestamp', nullable: true })
  codeExpiresAt?: Date; 

  @CreateDateColumn()
  createdAt!: Date; 
}