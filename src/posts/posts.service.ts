import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { Like } from './like.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Like)
    private likeRepository: Repository<Like>,
  ) {}

  async createPost(userId: number, mediaId: number, caption: string, type: 'photo' | 'reel') {
    const post = this.postRepository.create({
      user: { id: userId } as any,
      mediaId,
      caption,
      type,
    });
    return await this.postRepository.save(post);
  }

  async getFeed(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    return await this.postRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
  }

  async toggleLike(userId: number, postId: number) {
    const existingLike = await this.likeRepository.findOne({
      where: { user: { id: userId }, post: { id: postId } },
    });

    if (existingLike) {
      await this.likeRepository.remove(existingLike);
      await this.postRepository.decrement({ id: postId }, 'likesCount', 1);
      return { liked: false };
    } else {
      const like = this.likeRepository.create({
        user: { id: userId } as any,
        post: { id: postId } as any,
      });
      await this.likeRepository.save(like);
      await this.postRepository.increment({ id: postId }, 'likesCount', 1);
      return { liked: true };
    }
  }
}
