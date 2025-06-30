import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateSceneDto {
  @IsString()
  @IsNotEmpty()
  episodeId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  dialogue?: string;

  @IsArray()
  @IsOptional()
  charactersInScene?: string[];

  @IsString()
  @IsOptional()
  prompt?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
