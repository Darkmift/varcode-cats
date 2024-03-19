import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Cat } from './cats.entity';
import { User } from '@/auth/user.entity';

@Entity()
export class CatVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: [1, 2, 3, 4, 5],
    unique: true,
  })
  level: number;

  @OneToMany((type) => Cat, (cat) => cat.cat_type)
  cats: Cat[];

  @OneToMany((type) => User, (user) => user.cat_type)
  users: User[];
}
