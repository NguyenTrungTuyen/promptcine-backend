import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Episode, EPISODE_STATUS } from '../../database/schemas/episode.schema';
import { Model } from 'mongoose';
import { CreateEpisodeDto } from './dto/create-episode.dto';
import { GetEpisodesDto } from './dto/get-episode.dto';
import { parsePaginationQuery } from '../../common/utils/pagination-query';
import { ResOffsetPagination } from '../../common/utils/rh-reponse';
import { UpdateEpisodeDto } from './dto/update-episode.dto';

@Injectable()
export class EpisodeService {
  constructor(
    @InjectModel(Episode.name) private readonly episodeModel: Model<Episode>,
  ) {}

  async create(dto: CreateEpisodeDto) {
    const latest = await this.episodeModel
      .find({ projectId: dto.projectId })
      .sort({ orderIndex: -1 })
      .limit(1);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const nextIndex = latest?.[0]?.orderIndex + 1 || 1;
    return this.episodeModel.create({ ...dto, orderIndex: nextIndex });
  }

  async findById(id: string) {
    const ep = await this.episodeModel.findById(id);
    if (!ep) throw new NotFoundException('Episode not found');
    return ep;
  }

  async updateSceneCount(episodeId: string, count: number) {
    return this.episodeModel.findByIdAndUpdate(
      episodeId,
      { $set: { sceneCount: count } },
      { new: true },
    );
  }

  async getEpisodes(getEpisodesDto: GetEpisodesDto) {
    const { page, limit, sort, skip } = parsePaginationQuery(getEpisodesDto);
    const conditions: Record<string, any> = {
      projectId: getEpisodesDto.projectId,
      status: {
        $ne: EPISODE_STATUS.DELETED,
      },
    };
    if (getEpisodesDto?.textSearch) {
      conditions.$or = [
        { name: new RegExp(getEpisodesDto.textSearch, 'i') },
        { description: new RegExp(getEpisodesDto.textSearch, 'i') },
      ];
    }
    const [data, total] = await Promise.all([
      this.episodeModel.find(conditions).sort(sort).skip(skip).limit(limit),
      this.episodeModel.countDocuments(conditions),
    ]);
    const res: ResOffsetPagination<Episode> = {
      data,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      totalItems: total,
    };
    return res;
  }

  async updateEpisode(id: string, dto: UpdateEpisodeDto) {
    const episode = await this.episodeModel.findById(id);
    if (!episode) throw new NotFoundException('Episode not found');
    const allowedFields = ['name', 'script', 'duration'];
    const updatePayload = Object.fromEntries(
      Object.entries(dto).filter(
        ([key, value]) =>
          allowedFields.includes(key) && value !== undefined && value !== '',
      ),
    ) as Partial<UpdateEpisodeDto>;
    if (Object.keys(updatePayload).length === 0) {
      throw new NotFoundException('No valid fields to update');
    }
    await this.episodeModel.updateOne(
      { _id: id },
      {
        $set: updatePayload,
      },
    );
    return this.episodeModel.findById(id);
  }

  async deleteEpisodeById(id: string) {
    const episode = await this.episodeModel.findOne({
      _id: id,
      status: { $ne: EPISODE_STATUS.DELETED },
    });
    if (!episode) {
      throw new NotFoundException('Episode not found');
    }
    await this.episodeModel.updateOne(
      { _id: id },
      {
        $set: {
          status: EPISODE_STATUS.DELETED,
        },
      },
    );
    return {
      message: 'Episode deleted successfully',
      episodeId: id,
    };
  }
}
