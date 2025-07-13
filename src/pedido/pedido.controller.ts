import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@ApiTags('pedidos')
@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los pedidos activos' })
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
  updateEstado(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateEstadoDto,
  ) {
    return this.pedidoService.updateEstado(id, body.estado);
  }

  @Patch(':id/desactivado')
  @ApiOperation({ summary: 'Cancelar un pedido' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.pedidoService.deactivate(id);
  }

  @Patch(':id/restaurado')
  @ApiOperation({ summary: 'Restaurar un pedido cancelado' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.pedidoService.restore(id);
  }
}
