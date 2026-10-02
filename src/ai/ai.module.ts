import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { MoodTag } from './mood-tag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MoodTag])],
  controllers: [AiController],
  providers: [AiService],
})
export class AiModule {}
