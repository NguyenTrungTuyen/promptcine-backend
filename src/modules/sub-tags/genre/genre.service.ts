import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Genre } from 'src/database/schemas/genre.schema';
import mongoose, { Model } from 'mongoose';
import { FilterDto } from './dto/filter.dto';
import aqp from 'api-query-params';

@Injectable()
export class GenreService {

  constructor(@InjectModel(Genre.name) private genreModel: Model<Genre>) {}

 // check name unique
  isNameExit = async (name: string) => {
    const genre = await this.genreModel.exists({ name });
    if (genre) {
      console.log(`Genre: ${name} đã được sử dụng!`);
      return true;
    }
    return false;
  }
 async create(createGenreDto: CreateGenreDto) {
    const { name, description } = createGenreDto;
    // check name
    const isExit = await this.isNameExit(name);
    if (isExit === true) {
      throw new Error(`Genre name exit: ${name}.Hãy sử dụng tên khác!`);
    }
    const genre = await this.genreModel.create({
      name,
      description
    });

    console.log('Genre created:', genre);
    return 'Genre created successfully: ' + genre.name;
  }

// Cho phép filter theo name hoặc paginate limit/offset
  async findAll(filterDto : FilterDto) {
   const { filter, sort } = aqp(filterDto);
   const  current = filter.current || 1; 
   const pageSize = filter.pageSize || 10; 

   delete filter.current;
   delete filter.pageSize;

   const skip = (current - 1) * pageSize;
   const [results, totalItems] = await Promise.all([
      this.genreModel
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort(sort as any),

      this.genreModel.countDocuments(filter),
   ])
    const totalPages = Math.ceil(totalItems / pageSize);
    console.log(`Total items: ${totalItems}, Total pages: ${totalPages}`);
    return { results, totalItems, totalPages, current, pageSize };
  }
 

   async findByName(name?: string): Promise<Genre[]> {
    const filter: any = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' }; 
    }

    if (Object.keys(filter).length === 0) {
      console.log('Không có thể loại nào được tìm thấy.');
      return [];
    }
    
    return this.genreModel.find(filter);
  }

  async findById(id: string) {
    const genre = await this.genreModel.findById(id);
    if (!genre) {
      throw new Error(`Thể loại với ID ${id} không tồn tại.`);
    }
    console.log(`KQ: ${genre.name}`);
    return genre;
  }

  update(id,updateGenreDto: UpdateGenreDto) {
    const {  name, description } = updateGenreDto;
    return this.genreModel.findByIdAndUpdate(id, { name, description }, { new: true })
      .then(updatedGenre => { 
        if (!updatedGenre) {
          throw new Error(`Thể loại với ID ${id }không tồn tại.`);
        }
        console.log(`Cập nhật thành công: ${updatedGenre.name}`);
        return updatedGenre;
      })
      .catch(error => { 
        console.error(`Lỗi khi cập nhật thể loại: ${error.message}`);
        throw error;
      } );
  }

async delete(_id: string) {
     // check id
    if(mongoose.isValidObjectId(_id)){
      console.log("Deleted!");
      return this.genreModel.deleteOne({_id});
    }else{
      throw new BadRequestException("Invalid Id!")
    }
  }
}


