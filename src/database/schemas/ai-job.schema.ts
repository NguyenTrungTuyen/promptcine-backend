import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { AiJobStatus, AiJobType } from '../../interfaces/ai-job.interface';

@Schema({ timestamps: true })
export class AiJob extends Document {
  @Prop({ type: String, enum: Object.values(AiJobType), required: true })
  type: AiJobType;

  @Prop({ type: Types.ObjectId, ref: 'Scene' })
  sceneId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Episode' })
  episodeId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Character' })
  characterId?: Types.ObjectId;

  @Prop({
    type: String,
    enum: Object.values(AiJobStatus),
    default: AiJobStatus.PENDING,
  })
  status: AiJobStatus;

  @Prop()
  progress?: number;
  @Prop()
  duration?: number;

  @Prop({
    type: {
      imageUrl: String,
      videoUrl: String,
      errorMessage: String,
    },
  })
  result?: Record<string, any>;

  @Prop({ default: 0 })
  retryCount: number;

  @Prop()
  script?: string;

  @Prop()
  jobGroupId?: string;

  @Prop({ type: Object })
  metadata?: {
    prompt: string;
  };

  @Prop()
  updatedAt?: Date;
}

export const AiJobSchema = SchemaFactory.createForClass(AiJob);
AiJobSchema.index({ sceneId: 1 });
AiJobSchema.index({ characterId: 1 });
AiJobSchema.index({ status: 1, type: 1 });
AiJobSchema.index({ createdAt: -1 });
