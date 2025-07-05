import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear producto
  async create(createProductoDto: CreateProductoDto) {

    // busqueda de producto existente
    const existe = await  this.prisma.producto.findUnique({
      where: {nombre:createProductoDto.nombre},
    });

    if (existe){
      throw new NotFoundException (`El producto ${createProductoDto.nombre} ya  esxiste.`)
    }
    const producto = await this.prisma.producto.create({
      data: createProductoDto,
    });

    return {
      mensaje: 'Producto creado exitosamente',
      data: producto,
    };
  }

  // Obtener todos los productos
  async getAll() {
    const productos = await this.prisma.producto.findMany();
    return {
      mensaje: 'Lista de productos',
      data: productos,
      where:{activo: true},
    };
  }

  // Obtener un producto por ID
  async getProducto(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id , activo: true },
    });

    if (!producto) {
      throw new NotFoundException(` Producto con id ${id} no existe`);
    }

    return {
      mensaje: `Producto con id ${id} encontrado`,
      data: producto,
    };
  }

  // Actualizar producto
  async update(id: number, dto: UpdateProductoDto) {
    await this.getProducto(id); // Verifica si existe

    await this.prisma.producto.update({
      where: { id },
      data: dto,
    });

    const actualizado = await this.prisma.producto.findUnique({ where: { id } });

    return {
      mensaje: `Producto con id ${id} actualizado correctamente`,
      data: actualizado,
    };
  }

  // Eliminar producto
  async delete(id: number) {
    await this.getProducto(id); // Verifica si existe

    await this.prisma.producto.update({
      where: { id },
      data:{activo: false}
    });

    return {
      mensaje: `Producto con id ${id} eliminado correctamente`,
    };
  }
}
