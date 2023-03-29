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
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    name: string; 
  
    @IsNumber()
    @IsNotEmpty()
    @Min(0)
    @Max(120)
    age: number;

    @IsBoolean()
    @IsOptional()
    active: boolean;
}