import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GetEpisodesDto {
  @ApiProperty({ example: '64faba9aa6941e09ab8aefd3' })
  @IsMongoId()
  projectId: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(500)
  page?: string;

  @ApiPropertyOptional({ example: 20 })
  @IsInt()
  @IsOptional()
  @Min(1)
  @Max(200)
  limit?: number;

  @ApiPropertyOptional({ example: '' })
  @IsString()
  @IsOptional()
  textSearch?: string;

  @ApiPropertyOptional({ example: '-name' })
  @IsString()
  @IsOptional()
  sort?: string;
}
