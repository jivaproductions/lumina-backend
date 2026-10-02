import { Injectable } from '@nestjs/common';
import Anthropic from '@anthropic-ai/sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoodTag } from './mood-tag.entity';
import { Post } from '../posts/post.entity';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(MoodTag)
    private moodRepository: Repository<MoodTag>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  private anthropic = new Anthropic({
    apiKey: 'LUMINA_CLAUDE_API_KEY', // Will be in .env
  });

  async generateCaption(mediaType: 'photo' | 'reel', mood: string, context: string) {
    const prompt = `You are the AI creative partner for Lumina, a modern social app.
    The user has uploaded a ${mediaType}.
    The desired mood for the caption is: ${mood}.
    Context about the image: ${context}.

    Please provide 3 distinct, highly engaging caption options and 5 relevant hashtags.
    Format the response as JSON: { "captions": ["...", "...", "..."], "hashtags": ["...", "...", "..."] }`;

    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 500,
      messages: [{ role: 'user', content: prompt }],
    });

    return JSON.parse(message.content[0].text);
  }

  async generateDailyPrompt() {
    const prompt = `Generate a creative, authentic daily story challenge for social media users.
    The prompt should encourage users to share something personal, nostalgic, or inspiring.
    Keep it under 15 words.`;

    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-haiku-20240313',
      max_tokens: 100,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content[0].text;
  }

  async curateFeedByMood(mood: string, limit: number = 20) {
    const moodTag = await this.moodRepository.findOne({ where: { mood } });
    if (!moodTag) {
      // Fallback to newest posts if mood not found
      return this.postRepository.find({
        relations: ['user'],
        order: { createdAt: 'DESC' },
        take: limit,
      });
    }

    // Professional Logic: Filter posts that match the mood's characteristics
    return await this.postRepository.find({
      where: { aiMood: mood },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async detectPostMood(caption: string) {
    const prompt = `Analyze the following social media caption and categorize it into one of these moods: 'Energetic', 'Chill', 'Academic', 'Inspiring', 'Sad', 'Funny'.
    Caption: "${caption}"
    Return only the mood name.`;

    const message = await this.anthropic.messages.create({
      model: 'claude-3-5-haiku-20240313',
      max_tokens: 10,
      messages: [{ role: 'user', content: prompt }],
    });

    return message.content[0].text.trim();
  }
}
