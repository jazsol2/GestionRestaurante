import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ClientesService } from './cliente.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ParseIntPipe } from '@nestjs/common/pipes/parse-int.pipe';

@Controller('clientes')
export class ClienteController {
  constructor(private readonly clientesService: ClientesService) {}

  @Get()
  getAll() {
    return this.clientesService.getAll(); // <- método en memoria
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.getById(id);
  }

  @Post()
  create(@Body() createClienteDto: CreateClienteDto) {
    return this.clientesService.create(createClienteDto);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    return this.clientesService.update(+id, updateClienteDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.clientesService.remove(+id);
  }
}
