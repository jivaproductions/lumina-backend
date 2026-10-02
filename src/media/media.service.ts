import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from './media.entity';
import { ReelMetadata } from './reel-metadata.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private mediaRepository: Repository<Media>,
    @InjectRepository(ReelMetadata)
    private reelRepository: Repository<ReelMetadata>,
  ) {}

  private s3 = new AWS.S3({
    accessKeyId: 'LUMINA_AWS_KEY', // Will be in .env
    secretAccessKey: 'LUMINA_AWS_SECRET', // Will be in .env
    region: 'us-east-1',
  });

  async getUploadUrl(fileName: string, fileType: string) {
    const key = `uploads/${Date.now()}-${fileName}`;
    const params = {
      Bucket: 'lumina-media-storage',
      Key: key,
      ContentType: fileType,
      Expires: 3600, // URL valid for 1 hour
    };

    const url = await this.s3.getSignedUrlPromise('putObject', params);
    return { uploadUrl: url, key };
  }

  async saveMediaMetadata(userId: number, key: string, type: 'photo' | 'reel', url: string, reelDetails?: { duration: number, resolution: string }) {
    const media = this.mediaRepository.create({
      key,
      url,
      type,
      user: { id: userId } as any,
    });
    const savedMedia = await this.mediaRepository.save(media);

    if (type === 'reel' && reelDetails) {
      const reel = this.reelRepository.create({
        postId: savedMedia.id, // In a real app, we'd link to Post ID, here we use media ID for simplicity
        durationSeconds: reelDetails.duration,
        resolution: reelDetails.resolution,
        user: { id: userId } as any,
      });
      await this.reelRepository.save(reel);
    }

    return savedMedia;
  }

  async getDownloadUrl(key: string) {
    const params = {
      Bucket: 'lumina-media-storage',
      Key: key,
      Expires: 86400, // Valid for 24 hours
    };

    return this.s3.getSignedUrlPromise('getObject', params);
  }
}
