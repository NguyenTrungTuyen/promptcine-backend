import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Tag } from 'src/database/schemas/tag.schema';
import { FilterDto } from './dto/filter.dto';
import aqp from 'api-query-params';

@Injectable()
export class TagService {

   constructor(@InjectModel(Tag.name) private TagModel: Model<Tag>) {}

 async create(createTagDto: CreateTagDto) {
     const { name, description, systemDefined  } = createTagDto;
     const tag = await this.TagModel.create({
      name,description, systemDefined
    });
    console.log('Tag created:', tag);
    return 'Tag created successfully: ' + tag.name;
  }


async findAll(filterDto : FilterDto) {
   const { filter, sort } = aqp(filterDto);
   const  current = filter.current || 1; 
   const pageSize = filter.pageSize || 10; 

   delete filter.current;
   delete filter.pageSize;

   const skip = (current - 1) * pageSize;
   const [results, totalItems] = await Promise.all([
      this.TagModel
        .find(filter)
        .skip(skip)
        .limit(pageSize)
        .sort(sort as any),

      this.TagModel.countDocuments(filter),
   ])
    const totalPages = Math.ceil(totalItems / pageSize);
    console.log(`Total items: ${totalItems}, Total pages: ${totalPages}`);
    return { results, totalItems, totalPages, current, pageSize };
  }

  async findByTagname(name?: string): Promise<Tag[]> {
      const filter: any = {};
      if (name) {
        filter.name = { $regex: name, $options: 'i' }; 
      }
  
      if (Object.keys(filter).length === 0) {
        console.log('Không có tag nào phù hợp!.');
        return [];
      }
      
      return this.TagModel.find(filter);
    }

async findByType(type?: boolean): Promise<Tag[]> {
      const filter: any = {};
      if (typeof type === 'boolean') {
        filter.systemDefined = type;  
      }
      return this.TagModel.find(filter);
    }

async findById(id: string) {
   const tag = await this.TagModel.findById(id);
    if (!tag) {
      throw new Error(`Tag với ID ${id} không tồn tại.`);
    }
    console.log(`KQ: ${tag.name}`);
    return tag;
  }

  update(updateTagDto: UpdateTagDto) {
     const { _id, name, description, systemDefined } = updateTagDto;
    return this.TagModel.findByIdAndUpdate(_id, { name, description,systemDefined }, { new: true })
      .then(updatedTag => { 
        if (!updatedTag) {
          throw new Error(`Tag với ID ${_id} không tồn tại.`);
        }
        console.log(`Cập nhật thành công: ${updatedTag.name}`);
        return updatedTag;
      })
      .catch(error => { 
        console.error(`Lỗi khi cập nhật Tag: ${error.message}`);
        throw error;
      } );
  }

 async delete(_id: string) {
    // check id
    if(mongoose.isValidObjectId(_id)){
      const tag = await this.TagModel.findById(_id);
      if (!tag) {
        throw new BadRequestException(`Tag với ID ${_id} không tồn tại.`);
      }
      if (tag.systemDefined) {
        throw new BadRequestException('Không thể xóa tag hệ thống!');
      }
      console.log("Deleted!");
      return this.TagModel.deleteOne({_id});
      
    }else{
      throw new BadRequestException("Invalid Id!")
    }
  }
}
