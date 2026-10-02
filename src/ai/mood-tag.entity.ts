import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('mood_tags')
export class MoodTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mood: string; // e.g., 'Energetic', 'Chill', 'Academic', 'Inspiring'

  @Column('simple-array')
  keywords: string[]; // Keywords that define this mood

  @CreateDateColumn()
  createdAt: Date;
}
