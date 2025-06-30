import {
  IsString,
  IsNotEmpty,
  IsOptional,
  MinLength,
  MaxLength,
  IsIn,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CharacterGender } from '../../../database/schemas/character.schema';

export class CreateCharacterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'A brave hero' })
  @IsString()
  @IsIn(Object.values(CharacterGender))
  gender?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(5000)
  personality?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(5000)
  appearanceDescription?: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(5000)
  outfit?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsString()
  projectId: string;
}
