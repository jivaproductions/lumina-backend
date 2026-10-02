import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('generate-caption')
  @UseGuards(JwtAuthGuard)
  async generateCaption(@Body() body: { mediaType: 'photo' | 'reel', mood: string, context: string }) {
    return this.aiService.generateCaption(body.mediaType, body.mood, body.context);
  }

  @Get('daily-prompt')
  async getDailyPrompt() {
    return this.aiService.generateDailyPrompt();
  }
}
