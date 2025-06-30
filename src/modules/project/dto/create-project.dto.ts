import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsIn,
  IsInt,
  Min,
  Max,
  ValidateNested,
  MinLength,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ASPECT_RATIOS } from '../../../database/schemas/project.schema';
import { Type } from 'class-transformer';

class ResolutionDto {
  @IsInt()
  @Min(360)
  @Max(3840)
  @ApiProperty({ example: 1080, description: 'Width in pixels (360 - 3840)' })
  width: number;

  @IsInt()
  @Min(360)
  @Max(3840)
  @ApiProperty({ example: 1920, description: 'Height in pixels (360 - 3840)' })
  height: number;
}
export class CreateProjectDto {

  @ApiProperty({ example: 'My First Project' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'This is a sample project for AI video generation.' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(5000)
  description?: string;

  @ApiProperty({
    example: '9:16',
    enum: ASPECT_RATIOS,
    description: 'Allowed aspect ratios: 16:9, 9:16, 1:1',
  })
  @IsString()
  @IsOptional()
  @IsIn(ASPECT_RATIOS)
  aspectRatio?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ResolutionDto)
  @ApiProperty({
    type: ResolutionDto,
    example: { width: 1080, height: 1920 },
    description: 'Resolution of the video project',
  })
  resolution?: { width: number; height: number };

  @ApiProperty({ example: 'cinematic' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(255)
  style?: string;
}
