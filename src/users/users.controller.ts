import { Controller, Post, Delete, Get, UseGuards, Req, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('follow/:id')
  @UseGuards(JwtAuthGuard)
  async follow(@Req() req: any, @Param('id') id: string) {
    return this.usersService.toggleFollow(req.user.sub, Number(id));
  }

  @Get('following/:id')
  async getFollowing(@Param('id') id: string) {
    return this.usersService.getFollowing(Number(id));
  }

  @Get('followers/:id')
  async getFollowers(@Param('id') id: string) {
    return this.usersService.getFollowers(Number(id));
  }
}
