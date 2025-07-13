import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ClientesService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';
import { ApiOperation } from '@nestjs/swagger';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un cliente' })
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista de clientes activos' })
  getAll() {
    return this.clientesService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cliente activo por ID' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.getById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un cliente activo' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(id, updateClienteDto);
  }

  @Patch('desactivado/:id')
  @ApiOperation({ summary: 'Desactivar cliente' })
  desactivate(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.desactivate(id);
  }

  @Patch('restaurado/:id')
  @ApiOperation({ summary: 'Restaurar cliente' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.restore(id);
  }

  @Get('inactivos/listado')
  @ApiOperation({ summary: 'Listar clientes desactivado' })
  getAllInactive() {
    return this.clientesService.getAllInactive();
  }
}
