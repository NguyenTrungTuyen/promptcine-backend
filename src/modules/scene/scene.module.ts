import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Scene, SceneSchema } from '../../database/schemas/scene.schema';
import { SceneService } from './scene.service';
import { SceneController } from './scene.controller';
import { GenerateSceneDescriptionUseCase } from './use-cases/generate-scene-description.use-case';
import { forwardRef } from '@nestjs/common';
import { EpisodeModule } from '../episode/episode.module';

import { AiJobModule } from '../ai-job/ai-job.module';
import { GenerateSceneImageUseCase } from './use-cases/generate-scene-image.use-case';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Scene.name, schema: SceneSchema }]),
    forwardRef(() => EpisodeModule),
    AiJobModule,
  ],
  controllers: [SceneController],
  providers: [
    SceneService,
    GenerateSceneDescriptionUseCase,
    GenerateSceneImageUseCase,
  ],
  exports: [
    SceneService,
    GenerateSceneDescriptionUseCase,
    GenerateSceneImageUseCase,
  ],
})
export class SceneModule {}
