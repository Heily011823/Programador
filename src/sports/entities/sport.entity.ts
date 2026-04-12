import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Scenario } from '../../scenarios/entities/scenario.entity';

@Entity('sports')
export class Sport {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  name: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description?: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  maxPlayers?: number;

  @OneToMany(() => Scenario, (scenario) => scenario.sport)
  scenarios: Scenario[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}