import { ApiProperty} from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class UpdateGenreDto {

    @ApiProperty({ example: '685e43b30c7e8e6ee2d2e10f'})
    @IsMongoId({message: "Invalid Id! "})
    @IsNotEmpty({message: "Id must not be empty! "})
    _id : string;

    @ApiProperty({ example: 'Tên mới... ' })
    @IsOptional()
    name?:string;

    @ApiProperty({ example: 'Mô tả mới... ' })
    @MaxLength(200, { message: 'Mô tả quá dài, chỉ tối đa 200 kí tự' })
    @IsOptional()
    description?: string;
}