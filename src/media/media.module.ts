import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media } from './media.entity';
import { ReelMetadata } from './reel-metadata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Media, ReelMetadata])],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
