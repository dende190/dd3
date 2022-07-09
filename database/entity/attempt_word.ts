import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Word } from './word';

@Entity()
export class Attempt_word {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Word)
  @JoinColumn()
  word: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  created_on: Date;
}
