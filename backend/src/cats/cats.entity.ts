import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '@/auth/user.entity'; // Adjust the import path as necessary
import { ICat } from './types/cats.type';

@Entity()
export class Cat implements ICat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  birthday: Date;

  @Column()
  location: string;

  @Column()
  favorite_food: string;

  @Column()
  fur_color: string;

  @Column({ type: 'float' })
  height: number;

  @Column({ type: 'float' })
  weight: number;

  @Column()
  image_url: string;

  @OneToMany(() => CatVote, (catVote) => catVote.cat)
  likes: CatVote[];
}

@Entity()
@Unique(['user', 'cat'])
export class CatVote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.likes)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Cat, (cat) => cat.likes)
  @JoinColumn({ name: 'cat_id' })
  cat: Cat;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;
}
