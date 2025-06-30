import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, PROJECT_STATUS } from '../../database/schemas/project.schema';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsDto } from './dto/get-project.dto';
import { parsePaginationQuery } from '../../common/utils/pagination-query';
import { ResOffsetPagination } from '../../common/utils/rh-reponse';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
  ) {}

  async create(dto: CreateProjectDto): Promise<Project> {
    return await this.projectModel.create(dto);
  }

  async findById(id: string): Promise<Project> {
    const project = await this.projectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async getProjects(getProjectsDto: GetProjectsDto) {
    const { page, limit, sort } = parsePaginationQuery(getProjectsDto);
    const conditions: Record<string, any> = {
      status: {
        $ne: PROJECT_STATUS.DELETED,
      },
    };
    if (getProjectsDto?.textSearch) {
      conditions.$or = [
        { name: new RegExp(getProjectsDto.textSearch, 'i') },
        { description: new RegExp(getProjectsDto.textSearch, 'i') },
      ];
    }
    const [data, total] = await Promise.all([
      this.projectModel
        .find(conditions)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      this.projectModel.countDocuments(conditions),
    ]);
    const res: ResOffsetPagination<Project> = {
      data,
      currentPage: page,
      totalPage: Math.ceil(total / limit),
      totalItems: total,
    };
    return res;
  }

  async updateProjectById(
    id: string,
    dto: UpdateProjectDto,
  ): Promise<Project | null> {
    const allowedFields = ['name', 'description', 'style'];
    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    const updatePayload = Object.fromEntries(
      Object.entries(dto).filter(
        ([key, value]) =>
          allowedFields.includes(key) && value !== undefined && value !== '',
      ),
    ) as Partial<UpdateProjectDto>;
    if (Object.keys(updatePayload).length === 0) {
      throw new NotFoundException('No valid fields to update');
    }
    await this.projectModel.updateOne(
      { _id: id },
      {
        $set: updatePayload,
      },
    );
    return this.projectModel.findById(id);
  }

  async deleteProjectById(id: string) {
    const project = await this.findById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    await this.projectModel.updateOne(
      { _id: id },
      {
        $set: {
          status: PROJECT_STATUS.DELETED,
        },
      },
    );
    return {
      message: 'Project deleted successfully',
      projectId: id,
    };
  }
}
