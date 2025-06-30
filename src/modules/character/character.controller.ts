import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Res,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CharacterService } from './character.service';
import { CreateCharacterDto } from './dto/create-character.dto';
import { RHResponse } from '../../common/utils/rh-reponse';
import { GetCharactersDto } from './dto/get-character.dto';
import { ValidateObjectIdPipe } from '../../pipes/validate-object-id.pipe';

@ApiTags('character')
@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  @ApiOperation({ summary: 'Define new character' })
  async createCharacter(
    @Body() dto: CreateCharacterDto,
    @Res() res: RHResponse,
  ) {
    const resp = await this.characterService.createCharacter(dto);
    return res.RH.success(resp);
  }

  @Get()
  @ApiOperation({ summary: 'Get all characters of the project' })
  async getCharacters(
    @Query() getCharactersDto: GetCharactersDto,
    @Res() res: RHResponse,
  ) {
    const resp = await this.characterService.getCharacters(getCharactersDto);
    return res.RH.paging(resp);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get character by ID' })
  async getCharacterById(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.characterService.findById(id);
  }

  @Post(':id/generate-image')
  @ApiOperation({ summary: 'Generate character image' })
  async generateImage(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.characterService.createCharacterImageJob(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get character by ID' })
  async getOne(@Param('id', ValidateObjectIdPipe) id: string) {
    return this.characterService.findById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update character by ID' })
  async updateCharacterById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Body() dto: CreateCharacterDto,
    @Res() res: RHResponse,
  ) {
    const resp = await this.characterService.updateCharacterById(id, dto);
    return res.RH.success(resp);
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete character by ID' })
  async deleteCharacterById(
    @Param('id', ValidateObjectIdPipe) id: string,
    @Res() res: RHResponse,
  ) {
    const resp = await this.characterService.deleteCharacterById(id);
    return res.RH.success(resp);
  }
}
