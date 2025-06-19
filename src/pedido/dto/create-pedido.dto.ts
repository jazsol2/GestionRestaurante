import { IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
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
  @ValidateNested({ each: true })
  @Type(() => ProductoEnPedido)
  productos: ProductoEnPedido[];
}
