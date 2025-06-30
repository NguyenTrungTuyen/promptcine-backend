import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Query,
  Res,
  Put,
  Delete,
} from '@nestjs/common';
import { EpisodeService } from './episode.service';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { GetEpisodesDto } from './dto/get-episode.dto';
import { RHResponse } from '../../common/utils/rh-reponse';
import { UpdateEpisodeDto } from './dto/update-episode.dto';
import { ValidateObjectIdPipe } from '../../pipes/validate-object-id.pipe';

@ApiTags('episode')
@Controller('episodes')
export class EpisodeController {
  constructor(private readonly episodeService: EpisodeService) {}

  @Get()
  @ApiOperation({ summary: 'Get all episodes of a project' })
  async getEpisodes(
    @Query() getEpisodesDto: GetEpisodesDto,
    @Res() res: RHResponse,
  ) {
    const resp = await this.episodeService.getEpisodes(getEpisodesDto);
    return res.RH.paging(resp);
  }
  @Post()
  @ApiOperation({ summary: 'Create new episode' })
  async create(@Body() dto: CreateEpisodeDto, @Res() res: RHResponse) {
    const resp = await this.episodeService.create(dto);
    return res.RH.success(resp);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update episode by ID' })
  async updateEpisode(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() dto: UpdateEpisodeDto,
    @Res() res: RHResponse,
  ) {
    const resp = await this.episodeService.updateEpisode(id, dto);
    return res.RH.success(resp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get episode by ID' })
  async getOne(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Res() res: RHResponse,
  ) {
    const resp = await this.episodeService.findById(id);
    return res.RH.success(resp);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete episode by ID' })
  async deleteEpisodeById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Res() res: RHResponse,
  ) {
    const resp = await this.episodeService.deleteEpisodeById(id);
    return res.RH.success(resp);
  }
}
