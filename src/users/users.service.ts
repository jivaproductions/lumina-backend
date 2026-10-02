import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { Follow } from './follow.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Follow)
    private followRepository: Repository<Follow>,
  ) {}

  async create(user: Partial<User>) {
    const newUser = this.usersRepository.create(user);
    return await this.usersRepository.save(newUser);
  }

  async findByUsername(username: string): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { username } });
  }

  async findOne(id: number): Promise<User | null> {
    return await this.usersRepository.findOne({ where: { id } });
  }

  async updateProfile(id: number, updateData: Partial<User>) {
    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async toggleFollow(followerId: number, followingId: number) {
    const existingFollow = await this.followRepository.findOne({
      where: { follower: { id: followerId }, following: { id: followingId } },
    });

    if (existingFollow) {
      await this.followRepository.remove(existingFollow);
      return { following: false };
    } else {
      const follow = this.followRepository.create({
        follower: { id: followerId } as any,
        following: { id: followingId } as any,
      });
      await this.followRepository.save(follow);
      return { following: true };
    }
  }

  async getFollowing(userId: number) {
    return await this.followRepository.find({
      where: { following: { id: userId } },
      relations: ['follower'],
    });
  }

  async getFollowers(userId: number) {
    return await this.followRepository.find({
      where: { follower: { id: userId } },
      relations: ['following'],
    });
  }
}
