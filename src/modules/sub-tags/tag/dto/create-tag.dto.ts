import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength} from "class-validator"

export class CreateTagDto {
    @ApiProperty({ example: 'Tag 1' })
    @IsNotEmpty({message:"Tên tag không được để trống!"})
    name:string;

    @ApiProperty({ example: 'Mô tả 1 ' })
    @MaxLength(300, { message: 'Mô tả quá dài, chỉ tối đa 299 kí tự' })
    @IsOptional()
    description?: string;

    @ApiProperty({ default: false })
    systemDefined: boolean;
}
    