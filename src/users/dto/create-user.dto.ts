import { ApiProperty } from '@nestjs/swagger';
import {
    IsNotEmpty,
    IsString,
    IsNumber,
    MinLength,
    Min,
    Max,
    IsBoolean,
    IsOptional,
} from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string; 
  
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(120)
    age: number;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    active: boolean;
}