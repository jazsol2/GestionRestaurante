import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { DeleteManyModel } from 'typeorm';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  create(@Body() createPediddoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPediddoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los pedidos' })
  getAll() {
    return this.pedidoService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener detalle de un pedido' })
  getPedido(@Param('id', ParseIntPipe) id: number) {
    return this.pedidoService.getPedido(id);
  }

  @Put(':id/estado')
  @ApiOperation({ summary: 'Actualizar estado del pedido' })
  updateEstado(@Param('id') id: number, @Body() body: UpdateEstadoDto) {
    return this.pedidoService.updateEstado(id, body.estado as any);
  }

  @Delete(':id')
  @ApiOperation({summary : 'Eliminar pedido'})
  @ApiResponse({ status: 200, description: 'Pedido eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Pedido no encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
  return this.pedidoService.delete(id);
  }
}
