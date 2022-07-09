import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attempt_word } from '../entity/attempt_word';
import { User } from './user';

@Entity()
export class User_word {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn()
  user: number;

  @ManyToOne(() => Attempt_word)
  @JoinColumn()
  attempt_word: number;

  @Column()
  word: string;

  @Column()
  is_correct: boolean;
}
