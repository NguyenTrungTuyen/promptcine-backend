import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';


export const EPISODE_STATUS = {
  PENDING: 'pending',
  GENERATING: 'generating',
  DONE: 'done',
  ERROR: 'error',
  DELETED: 'deleted',
};
@Schema({ timestamps: true })
export class Episode extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Project', required: true })
  projectId: Types.ObjectId;

  @Prop()
  name: string;

  @Prop()
  script?: string;

  @Prop()
  duration?: number; // in seconds

  @Prop()
  orderIndex?: number;

  @Prop({ default: 0 })
  sceneCount: number;

  @Prop({
    type: String,
    enum: Object.values(EPISODE_STATUS),
    default: EPISODE_STATUS.PENDING,
  })
  status: string;
}

export const EpisodeSchema = SchemaFactory.createForClass(Episode);
EpisodeSchema.index({ projectId: 1, orderIndex: 1 });
EpisodeSchema.index({ status: 1 });
