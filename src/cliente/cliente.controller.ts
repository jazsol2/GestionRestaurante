import {Controller, Get, Post, Put, Delete, Body, Param,} from '@nestjs/common';
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
  @ApiOperation({ summary: 'Lista de clientes' })
  getAll() {
    return this.clientesService.getAll(); // <- método en memoria
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar por ID de cliente' })
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.getById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar Cliente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar cliente' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(+id);
  }
}
