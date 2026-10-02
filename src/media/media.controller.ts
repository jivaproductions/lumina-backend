import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { MediaService } from './media.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('media')
export class MediaController {
  constructor(private mediaService: MediaService) {}

  @Post('upload-url')
  @UseGuards(JwtAuthGuard)
  async getUploadUrl(@Body() body: { fileName: string, fileType: string }) {
    const url = await this.mediaService.getUploadUrl(body.fileName, body.fileType);
    return { uploadUrl: url };
  }
}
