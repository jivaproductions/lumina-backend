import { Controller, Patch, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('profile')
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @Patch('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Req() req: any, @Body() body: any) {
    const userId = req.user.sub; // Get user ID from JWT token
    return this.usersService.updateProfile(userId, {
      bio: body.bio,
      avatarUrl: body.avatarUrl,
    });
  }
}
