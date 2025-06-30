import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export const ASPECT_RATIOS = ['16:9', '9:16', '1:1'];
export const PROJECT_STATUS = {
  PENDING: 'pending',
  DRAFT: 'draft',
  PUBLISHED: 'published',
  DELETED: 'deleted',
};
@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;

  @Prop()
  aspectRatio?: string; // e.g. "16:9"

  @Prop({
    type: {
      width: Number,
      height: Number,
    },
  })
  resolution?: { width: number; height: number };

  @Prop()
  style?: string;

  @Prop({ type: String, ref: 'User' })
  userId?: string;

  @Prop({
    type: String,
    enum: Object.values(PROJECT_STATUS),
    default: PROJECT_STATUS.PENDING,
  })
  status: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
ProjectSchema.index({ userId: 1, createdAt: -1 });
