import { ApiProperty } from "@nestjs/swagger";
import { IsMongoId, IsNotEmpty, IsOptional, MaxLength} from "class-validator"

export class UpdateTagDto  {
        
        // @ApiProperty({ example: '685e43b30c7e8e6ee2d2e10f'})
        // @IsMongoId({message: "Invalid Id! "})
        // @IsNotEmpty({message: "Id must not be empty! "})
        // _id : string;
        
        @ApiProperty({ example: 'Tên tag mới... ' })
        @IsOptional()
        name?:string;
    
        @ApiProperty({ example: 'Mô tả tag mới... ' })
        @MaxLength(300, { message: 'Mô tả quá dài, chỉ tối đa 299 kí tự' })
        @IsOptional()
        description?: string;
    
        @ApiProperty({ default: false })
        @IsOptional()
        systemDefined?: boolean;
}
