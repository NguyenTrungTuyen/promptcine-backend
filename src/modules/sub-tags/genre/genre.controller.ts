import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { GenreService } from './genre.service';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilterDto } from './dto/filter.dto';


@ApiTags('Genres')
@Controller('genre')
export class GenreController {
    constructor(private readonly genreService: GenreService) {}
      
    @Post()
    @ApiOperation({ summary: 'Thêm thể loại Film mới [!! Không tạo tên trùng nhau]]' })
    create(@Body() createGenreDto: CreateGenreDto) {
      return this.genreService.create(createGenreDto);
    }
      
    // Danh sách thể loại Film , sort, paginate
    @Get()
    @ApiOperation({ summary: 'Danh sách thể loại Film' })
    async findAll(@Query() filterDto: FilterDto) {
      return this.genreService.findAll(filterDto);
    }

    // find by name
    @Get('findbyname')
    @ApiOperation({ summary: 'Tìm kiếm thể loại film theo "name"' })
    @ApiQuery({ name: 'name', required: false, description: 'Tìm theo tên thể loại' })
    async findByName(@Query('name') name?: string) {
      return this.genreService.findByName(name);
    }


    @Get(':id')
    @ApiOperation({ summary: 'Tìm kiếm thể loại film theo id' })
    @ApiParam({ name: 'id', description: 'Tìm theo ID' })
    findOne(@Param('id') id: string) {
      return this.genreService.findById(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Cập nhật thể loại film theo' })
    @ApiParam({ name: 'id', description: 'ID cần cập nhật' })
    @ApiResponse({ status: 200, description: 'Câp nhật thành công' })
    @ApiResponse({ status: 400, description: 'Câp nhật thất bại' })
    update(@Param('id') id : string, @Body() updateGenreDto: UpdateGenreDto) {
      console.log('information input:',updateGenreDto );
      return this.genreService.update(id,updateGenreDto);
    }


    @Delete(':id')
    @ApiOperation({ summary: 'Xoá thể loại film theo id' })
    @ApiParam({ name: 'id', description: 'Xóa theo ID' })
    remove(@Param('id') id: string) {
      return this.genreService.delete(id);
    }
}
