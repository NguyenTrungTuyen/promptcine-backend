import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export const CharacterGender = {
  MALE: 'male',
  FEMALE: 'female',
  NON_BINARY: 'non-binary',
  OTHER: 'other',
};

export const CHARACTER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'done',
  DELETED: 'deleted',
};
@Schema({ timestamps: { createdAt: true, updatedAt: true } })
export class Character extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Project', required: true })
  projectId: string;

  @Prop({ required: true })
  name: string;

  @Prop({
    type: String,
    enum: Object.values(CharacterGender),
  })
  gender: string;

  @Prop()
  personality: string;

  @Prop()
  outfit: string;

  @Prop()
  appearanceDescription: string;

  @Prop()
  imageUrl: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'AiJob' })
  aiImageJobId?: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Episode' }] })
  usedInEpisodes: string[];

  @Prop({
    type: String,
    enum: Object.values(CHARACTER_STATUS),
    default: CHARACTER_STATUS.PENDING,
  })
  status: string;
}

export const CharacterSchema = SchemaFactory.createForClass(Character);

CharacterSchema.index({ projectId: 1, name: 1 });
CharacterSchema.index({ usedInEpisodes: 1 });
