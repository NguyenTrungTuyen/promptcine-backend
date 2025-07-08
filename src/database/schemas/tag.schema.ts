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