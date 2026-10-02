import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  key: string; // The S3 key/path to the file

  @Column()
  url: string; // The public or signed URL

  @Column()
  type: 'photo' | 'reel';

  @Column({ nullable: true })
  mimeType: string;

  @Column({ nullable: true })
  size: number;

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @CreateDateColumn()
  createdAt: Date;
}
