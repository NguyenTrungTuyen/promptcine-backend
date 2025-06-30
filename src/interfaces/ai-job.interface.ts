export enum AiJobType {
  GENERATE_IMAGE = 'generate-image',
  GENERATE_VIDEO = 'generate-video',
  GENERATE_SCENE_DESCRIPTION = 'generate-scene-description',
  GENERATE_CHARACTER_IMAGE = 'generate-character-image',
}

export enum AiJobStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  DONE = 'done',
  ERROR = 'error',
}
