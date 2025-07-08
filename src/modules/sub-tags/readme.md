 1. Module: Genre
✅ Mục đích:
Quản lý danh sách thể loại phim (Genre), như: hành động, lãng mạn, khoa học viễn tưởng, v.v.
Các Project có thể liên kết với nhiều Genre.
🔶 Database Schema: genre.schema.ts
ts
Sao chépChỉnh sửa
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Genre extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;
}

export const GenreSchema = SchemaFactory.createForClass(Genre);

📁 2. Module: Tag
✅ Mục đích:
Quản lý các nhãn mô tả nội dung chi tiết (Tag) như "cảnh mưa", "đêm tối", "xác sống", dùng để gắn vào Scene, Character, Episode nhằm hỗ trợ prompt sinh ảnh/video.
🔶 Database Schema: tag.schema.ts
ts
Sao chépChỉnh sửa
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Tag extends Document {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ default: false })
  systemDefined: boolean; // Dùng để phân biệt tag do hệ thống gợi ý
}

export const TagSchema = SchemaFactory.createForClass(Tag);

📌 Task chi tiết cho fresher
🧩 Task 1 – Tạo module Genre
Mục tiêu:
Xây dựng module Genre hoàn chỉnh với các tính năng CRUD.
Yêu cầu cụ thể:
* Tạo file genre.schema.ts (như trên)
* Tạo genre.service.ts với các hàm:
    * create()
    * findAll()
    * findById()
    * update()
    * delete()
* Tạo genre.controller.ts với route bắt đầu bằng /genres
* Tạo DTO:
    * create-genre.dto.ts
    * update-genre.dto.ts
* Validate các input (tên không trùng, mô tả tối đa 200 ký tự)
* Gắn @ApiTags('Genres') và @ApiOperation mô tả rõ API
Bonus: Cho phép filter theo name hoặc paginate limit/offset

🧩 Task 2 – Tạo module Tag
Mục tiêu:
Xây dựng module Tag có thể dùng để gắn vào Scene, Character, Episode trong tương lai.
Yêu cầu cụ thể:
* Tạo file tag.schema.ts (như trên)
* Tạo tag.service.ts với các hàm:
    * create()
    * findAll()
    * findById()
    * update()
    * delete()
* Tạo tag.controller.ts với route /tags
* Tạo DTO:
    * create-tag.dto.ts
    * update-tag.dto.ts
* Validate input:
    * name phải unique
    * description là optional
    * systemDefined mặc định là false, không cần truyền khi tạo
* Gắn Swagger tag @ApiTags('Tags')
Bonus:
* Cho phép tìm kiếm theo từ khóa name (query param: ?search=rain)
* Không cho phép xóa nếu tag có systemDefined = true
