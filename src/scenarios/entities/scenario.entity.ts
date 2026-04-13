import {Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn,} from 'typeorm';
import { Sport } from '../../sports/entities/sport.entity';
import { ScenarioStatus } from '../enums/scenario-status.enum';

@Entity('scenarios')
export class Scenario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  location: string;

  @Column({ type: 'int' })
  capacity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({
    type: 'enum',
    enum: ScenarioStatus,
    default: ScenarioStatus.AVAILABLE,
  })
  status: ScenarioStatus;

  @ManyToOne(() => Sport, (sport) => sport.scenarios, {
    nullable: false,
    eager: true,
  })
  sport: Sport;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}