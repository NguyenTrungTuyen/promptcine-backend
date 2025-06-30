import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Character,
  CHARACTER_STATUS,
} from '../../database/schemas/character.schema';
import { Model } from 'mongoose';
import { CreateCharacterDto } from './dto/create-character.dto';
import { AiJobService } from '../ai-job/ai-job.service';
import { AiJobType } from '../../interfaces/ai-job.interface';
import { parsePaginationQuery } from '../../common/utils/pagination-query';
import { ResOffsetPagination } from '../../common/utils/rh-reponse';
import { GetCharactersDto } from './dto/get-character.dto';

@Injectable()
export class CharacterService {
  constructor(
    @InjectModel(Character.name)
    private readonly characterModel: Model<Character>,
    private readonly aiJobService: AiJobService,
  ) {}

  async createCharacter(dto: CreateCharacterDto): Promise<Character> {
    const existing = await this.characterModel.findOne({
      projectId: dto.projectId,
      name: dto.name,
    });
    if (existing) {
      throw new Error('Character with this name already exists in the project');
    }
    return this.characterModel.create(dto);
  }

  async findById(id: string): Promise<Character> {
    const char = await this.characterModel.findById(id);
    if (!char) throw new NotFoundException('Character not found');
    return char;
  }

  async createCharacterImageJob(characterId: string) {
    const char = await this.findById(characterId);
    const prompt = `Full body image of ${char.name} — ${char.appearanceDescription}, outfit: ${char.outfit}`;
    const job = await this.aiJobService.createJob({
      type: AiJobType.GENERATE_CHARACTER_IMAGE,
      characterId,
      metadata: { prompt },
    });

    await this.characterModel.findByIdAndUpdate(characterId, {
      aiImageJobId: job._id,
    });
    return job;
  }

  async getCharacters(getCharactersDto: GetCharactersDto) {
    const { page, limit, sort, skip } = parsePaginationQuery(getCharactersDto);
    const conditions: Record<string, any> = {
      projectId: getCharactersDto.projectId,
      status: { $ne: CHARACTER_STATUS.DELETED },
    };
    if (getCharactersDto?.textSearch) {
      conditions.$or = [
        { name: new RegExp(getCharactersDto.textSearch, 'i') },
        { appearanceDescription: new RegExp(getCharactersDto.textSearch, 'i') },
      ];
    }
    const [data, total] = await Promise.all([
      this.characterModel.find(conditions).sort(sort).skip(skip).limit(limit),
      this.characterModel.countDocuments(conditions),
    ]);
    const res: ResOffsetPagination<Character> = {
      data,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      totalItems: total,
    };
    return res;
  }

  async deleteCharacterById(id: string) {
    const character = await this.characterModel.findOne({
      _id: id,
      status: { $ne: CHARACTER_STATUS.DELETED },
    });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    await this.characterModel.updateOne(
      { _id: id },
      {
        $set: {
          status: CHARACTER_STATUS.DELETED,
        },
      },
    );
    return {
      message: 'Character deleted successfully',
      characterId: id,
    };
  }
  async updateCharacterById(id: string, dto: CreateCharacterDto) {
    const character = await this.characterModel.findOne({
      _id: id,
      status: { $ne: CHARACTER_STATUS.DELETED },
    });
    if (!character) {
      throw new NotFoundException('Character not found');
    }
    const allowedFields = [
      'name',
      'appearanceDescription',
      'outfit',
      'projectId',
    ];
    const updatePayload = Object.fromEntries(
      Object.entries(dto).filter(
        ([key, value]) =>
          allowedFields.includes(key) && value !== undefined && value !== '',
      ),
    ) as Partial<CreateCharacterDto>;
    if (Object.keys(updatePayload).length === 0) {
      throw new NotFoundException('No valid fields to update');
    }
    if (updatePayload.name) {
      const existing = await this.characterModel.findOne({
        projectId: character.projectId,
        name: updatePayload.name,
        _id: { $ne: id },
      });
      if (existing) {
        throw new Error(
          'Character with this name already exists in the project',
        );
      }
    }
    await this.characterModel.updateOne(
      { _id: id },
      {
        $set: updatePayload,
      },
    );
    return this.characterModel.findById(id);
  }
}
