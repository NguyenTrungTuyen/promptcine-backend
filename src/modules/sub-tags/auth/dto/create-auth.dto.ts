import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MinLength } from "class-validator"

export class CreateAuthDto {
    @ApiProperty({ example: 'email1@gmail.com' })
    @IsNotEmpty({message:"Email không được để trống!"})
    email:string;

    @ApiProperty({ example: '123456' })
    @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
    @IsNotEmpty({message:"Mật khẩu không được để trống"})
    password: string;

    @ApiProperty({ example: 'Your Name' })
    @IsOptional()
    name?:string;
}
