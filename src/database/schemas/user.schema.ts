
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true})
export class User extends Document {
  @Prop()
  name?: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop({ default: null })
  image?: string; // Lưu đường dẫn đến file ảnh

  @Prop({default: 'USER'})
  role: string;

  @Prop({default: false})
  isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
