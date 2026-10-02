import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Story } from './story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private storyRepository: Repository<Story>,
  ) {}

  async createStory(userId: number, mediaId: number, caption?: string) {
    const createdAt = new Date();
    const expiresAt = new Date();
    expiresAt.setHours(createdAt.getHours() + 24);

    const story = this.storyRepository.create({
      user: { id: userId } as any,
      mediaId,
      caption,
      createdAt,
      expiresAt,
    });
    return await this.storyRepository.save(story);
  }

  async getActiveStories() {
    return await this.storyRepository.find({
      where: {
        expiresAt: MoreThan(new Date()),
      },
      relations: ['user'],
      order: { createdAt: 'ASC' },
    });
  }

  async cleanupExpiredStories() {
    const now = new Date();
    return await this.storyRepository.delete({
      expiresAt: LessThan(now),
    });
  }
}
