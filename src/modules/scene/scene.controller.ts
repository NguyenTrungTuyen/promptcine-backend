import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SceneService } from './scene.service';
import { GenerateSceneImageUseCase } from './use-cases/generate-scene-image.use-case';
import { GenerateSceneDescriptionUseCase } from './use-cases/generate-scene-description.use-case';

@ApiTags('scene')
@Controller('scenes')
export class SceneController {
  constructor(
    private readonly sceneService: SceneService,
    private readonly generateImage: GenerateSceneImageUseCase,
    private readonly generateSceneDescription: GenerateSceneDescriptionUseCase,
  ) {}

  @Get(':id')
  @ApiOperation({ summary: 'Get scene by ID' })
  findById(@Param('id') id: string) {
    return this.sceneService.findById(id);
  }

  @Post(':id/generate-image')
  @ApiOperation({ summary: 'Generate image for a scene (create AI job)' })
  async generateImageForScene(@Param('id') id: string) {
    return await this.generateImage.execute(id);
  }

  @Post('/generate-from-episode/:episodeId')
  @ApiOperation({ summary: 'Generate scenes from episode script' })
  async generateFromScript(@Param('episodeId') episodeId: string) {
    return this.generateSceneDescription.execute(episodeId);
  }
}
