import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength} from "class-validator"

export class CreateTagDto {
    @ApiProperty({ example: 'Tên tag... ' })
    @IsNotEmpty({message:"Tên tag không được để trống!"})
    name:string;

    @ApiProperty({ example: 'Mô tả... ' })
    @MaxLength(300, { message: 'Mô tả quá dài, chỉ tối đa 299 kí tự' })
    @IsOptional()
    description?: string;

    @ApiProperty({ default: false })
    systemDefined: boolean;
}
    