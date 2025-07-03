import { Type } from 'class-transformer';
import { IsString, IsNumber, MinLength, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @MinLength(5)
  descripcion: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.10)
  precio: number;

  @Type(() => Number)
  @IsNumber()
  @Min(1)
  stock: number;
}
