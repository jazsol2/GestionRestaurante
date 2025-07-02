import { IsString, IsArray, IsNumber, ValidateNested, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

class ProductoEnPedido {
  @IsNumber()
  productoId: number;

  @IsNumber()
  cantidad: number;
}

export class CreatePedidoDto {
  @IsNumber()
  clienteId: number;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductoEnPedido)
  productos: ProductoEnPedido[];
}
