import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class AiJobLog extends Document {
  @Prop({ type: Types.ObjectId, ref: 'AiJob', required: true })
  aiJobId: Types.ObjectId;

  @Prop()
  prompt?: string;

  @Prop()
  seed?: string;

  @Prop()
  provider?: string;

  @Prop()
  originalPrompt?: string;

  @Prop()
  finalPrompt?: string;

  @Prop({ type: Object })
  rawRequest?: Record<string, any>;

  @Prop({ type: Object })
  rawResponse?: Record<string, any>;

  @Prop()
  errorMessage?: string;
}

export const AiJobLogSchema = SchemaFactory.createForClass(AiJobLog);
AiJobLogSchema.index({ aiJobId: 1 });
AiJobLogSchema.index({ createdAt: -1 });
