import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductosService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { UpdateProductoDto } from './dto/update-producto.dto';

@ApiTags('productos')
@Controller('productos')
export class ProductoController {
  constructor(private readonly productoService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un producto' })
  create(@Body() dto: CreateProductoDto) {
    return this.productoService.createProducto(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista de todos los productos' })
  getAll() {
    return this.productoService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por la ID' })
  getProducto(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.getProducto(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProductoDto,
  ) {
    return this.productoService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un producto' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoService.delete(id);
  }
}
