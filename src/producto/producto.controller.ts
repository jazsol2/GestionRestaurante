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
import { ProductosService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('productos')
@Controller('productos')
export class ProductoController {
  constructor(private readonly productosService: ProductosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  create(@Body() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los productos activos' })
  getAll() {
    return this.productosService.getAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un producto por ID' })
  getProducto(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.getProducto(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un producto' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDto: UpdateProductoDto,
  ) {
    return this.productosService.update(id, updateProductoDto);
  }

  @Patch(':id/desactivado')
  @ApiOperation({ summary: 'Desactivar producto' })
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.deactivate(id);
  }

  @Patch(':id/restaurado')
  @ApiOperation({ summary: 'Restaurar un producto' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.productosService.restore(id);
  }
}
