import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Res,
  Put,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { GetProjectsDto } from './dto/get-project.dto';
import { RHResponse } from '../../common/utils/rh-reponse';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ValidateObjectIdPipe } from '../../pipes/validate-object-id.pipe';

@ApiTags('project')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'List all projects' })
  async getProjects(
    @Query() getProjectsDto: GetProjectsDto,
    @Res() res: RHResponse,
  ) {
    const resp = await this.projectService.getProjects(getProjectsDto);
    return res.RH.paging(resp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by ID' })
  findOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.projectService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new project' })
  create(@Body() dto: CreateProjectDto) {
    return this.projectService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update project by ID' })
  async updateProjectById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() dto: UpdateProjectDto,
    @Res() res: RHResponse,
  ) {
    const resp = await this.projectService.updateProjectById(id, dto);
    return res.RH.success(resp);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by ID' })
  async deleteProjectById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Res() res: RHResponse,
  ) {
    const resp = await this.projectService.deleteProjectById(id);
    return res.RH.success(resp);
  }
}
