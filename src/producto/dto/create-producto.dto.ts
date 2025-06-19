import { IsString, IsNumber, MinLength, Min } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MinLength(3)
  nombre: string;

  @IsString()
  @MinLength(5)
  descripcion: string;

  @IsNumber()
  @Min(0.1)
  precio: number;
}
