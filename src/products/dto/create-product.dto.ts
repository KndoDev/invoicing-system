import {
   IsInt,
   IsNumber,
   IsOptional,
   IsPositive,
   IsString,
   MinLength,
} from 'class-validator';

export class CreateProductDto {
   @IsString()
   @MinLength(1)
   name: string;

   @IsNumber()
   @IsPositive()
   price: number;

   @IsInt()
   @IsPositive()
   @IsOptional()
   stock?: number;
}
