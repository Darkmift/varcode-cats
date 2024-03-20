import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { CatVote } from '@/cats/cats.entity';
import { IAdmin, IUser, Role } from './auth.types';
import { CatVariant } from '@/cats/cat-type.entity';

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

  @Column()
  cat_type_id: string;

  @ManyToOne(() => CatVariant, (catVariant) => catVariant.users)
  @JoinColumn({ name: 'cat_type_id' })
  // @ts-ignore
  cat_type: CatVariant;
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
  accessLevel: Role.ADMIN | Role.SUPER_ADMIN;
}
