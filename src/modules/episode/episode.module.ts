import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Episode, EpisodeSchema } from '../../database/schemas/episode.schema';
import { EpisodeService } from './episode.service';
import { EpisodeController } from './episode.controller';
import { forwardRef } from '@nestjs/common';
import { SceneModule } from '../scene/scene.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Episode.name, schema: EpisodeSchema }]),
    forwardRef(() => SceneModule),
  ],
  providers: [EpisodeService],
  controllers: [EpisodeController],
  exports: [EpisodeService],
})
export class EpisodeModule {}
