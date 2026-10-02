import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, OneToMany } from 'typeorm';
import { User } from '../users/user.entity';
import { Like } from './like.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  caption: string;

  @Column()
  mediaId: number;

  @Column({ default: 'photo' })
  type: 'photo' | 'reel';

  @Column({ default: 0 })
  likesCount: number;

  @Column({ nullable: true })
  aiMood: string; // The mood detected by AI

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @CreateDateColumn()
  createdAt: Date;
}
