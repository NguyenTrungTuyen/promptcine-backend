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
