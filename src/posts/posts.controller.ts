import { Controller, Post, Get, Body, Query, Patch, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Req() req: any, @Body() body: { mediaId: number, caption: string, type: 'photo' | 'reel' }) {
    return this.postsService.createPost(req.user.sub, body.mediaId, body.caption, body.type);
  }

  @Get('feed')
  async getFeed(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postsService.getFeed(Number(page) || 1, Number(limit) || 10);
  }

  @Patch(':id/like')
  @UseGuards(JwtAuthGuard)
  async likePost(@Req() req: any, @Param('id') id: string) {
    return this.postsService.toggleLike(req.user.sub, Number(id));
  }
}
