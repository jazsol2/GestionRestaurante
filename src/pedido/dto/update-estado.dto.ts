import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEstadoDto {
  @ApiProperty({ example: 'enviado', description: 'Nuevo estado del pedido' })
  @IsString()
  @IsIn(['pendiente', 'enviado', 'entregado', 'cancelado'])
  estado: string;
}
