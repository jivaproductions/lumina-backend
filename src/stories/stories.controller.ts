import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { StoriesService } from './stories.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('stories')
export class StoriesController {
  constructor(private storiesService: StoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() body: { mediaId: number, caption?: string }) {
    return this.storiesService.createStory(req.user.sub, body.mediaId, body.caption);
  }

  @Get()
  async getStories() {
    return this.storiesService.getActiveStories();
  }
}
