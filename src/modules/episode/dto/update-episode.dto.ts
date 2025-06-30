import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class UpdateEpisodeDto {
  @ApiPropertyOptional({ example: 'Episode 1: The Beginning' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ example: 'This is the first episode of the series.' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10000)
  script?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10000)
  duration?: number;
}
