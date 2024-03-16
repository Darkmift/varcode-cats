import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { CatVote } from '@/cats/cats.entity';
import { IAdmin, IUser } from './auth.types';

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => CatVote, (like) => like.user)
  likes: CatVote[];
}

@Entity()
export class Admin implements IAdmin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column()
  accessLevel: 'admin' | 'super-admin';
}
