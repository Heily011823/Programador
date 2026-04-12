import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 20 })
  phone: string;

  @Column()
  password: string;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column({ type: 'varchar', length: 6, nullable: true })
  verificationCode: string | null;
}