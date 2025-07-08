import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength} from "class-validator"

export class CreateGenreDto {
    @ApiProperty({ example: 'Tên thể loại... ' })
    @IsNotEmpty({message:"Tên loại không được để trống!"})
    name:string;

    @ApiProperty({ example: 'Mô tả... ' })
    @MaxLength(200, { message: 'Mô tả quá dài, chỉ tối đa 200 kí tự' })
    @IsOptional()
    description?: string;
}
    