import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';

@ApiTags('Tags')
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  @ApiOperation({ summary: 'Thêm Tag mới' })
  create(@Body() createTagDto: CreateTagDto) {
    return this.tagService.create(createTagDto);
  }

  @Get()
  @ApiOperation({ summary: 'Danh sách Tag' })
  async findAll(@Query() filterDto: FilterDto) {
    return this.tagService.findAll(filterDto);
  }

 // find by tagname
@Get('findbyTagname')
@ApiOperation({ summary: 'Tìm kiếm tag theo "Tagname"' })
@ApiQuery({ name: 'name', required: false, description: 'Tìm theo Tagname' })
async findByTagname(@Query('name') name?: string) {
  return this.tagService.findByTagname(name);
}

//find by systemDefined
@Get('findbysystemDefined')
@ApiOperation({ summary: 'Tìm kiếm tag theo "systemDefined"' })   
@ApiQuery({ name: 'systemDefined', required: false, description: 'Tìm theo systemDefined' })
async findBysystemDefined(@Query('systemDefined') systemDefined?: boolean) {
  return this.tagService.findByType(systemDefined);
}


 @Get(':id')
 @ApiOperation({ summary: 'Tìm kiếm tag theo ID' })
 @ApiParam({ name: 'id', description: 'Tìm theo ID' })
 findOne(@Param('id') id: string) {
   return this.tagService.findById(id);
 }

  @Put(':id')
 @ApiOperation({ summary: 'Cập nhật tag theo id' })
 @ApiParam({ name: 'id', description: 'ID cần cập nhật' })
 @ApiResponse({ status: 200, description: 'Câp nhật thành công' })
 @ApiResponse({ status: 400, description: 'Câp nhật thất bại' })
 update(@Param('id') id : string, @Body() updateTagDto: UpdateTagDto) {
   console.log('information input:',updateTagDto );
   return this.tagService.update(id, updateTagDto);
 }

  // Không cho phép xóa nếu tag có systemDefined = true
  @Delete(':id')
  @ApiOperation({ summary: 'Xoá tag theo id' })
  @ApiParam({ name: 'id', description: 'Xóa theo ID' })
  remove(@Param('id') id: string) {
    return this.tagService.delete(id);
  }
}
