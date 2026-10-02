import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, Unique } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('follows')
@Unique(['follower', 'following'])
export class Follow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  follower: User;

  @ManyToOne(() => User)
  following: User;

  @CreateDateColumn()
  createdAt: Date;
}
