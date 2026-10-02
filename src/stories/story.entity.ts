import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('stories')
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mediaId: number;

  @Column({ nullable: true })
  caption: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @ManyToOne(() => User, (user) => user.id)
  user: User;
}
