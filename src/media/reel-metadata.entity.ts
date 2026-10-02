import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('reels_metadata')
export class ReelMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  postId: number;

  @Column({ type: 'int' })
  durationSeconds: number;

  @Column()
  resolution: string; // e.g. "1080x1920"

  @Column({ default: false })
  isLooping: boolean;

  @Column({ default: 'auto' })
  playbackSpeed: string;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
