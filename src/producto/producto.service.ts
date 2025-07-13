import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProductoDto } from "./dto/create-producto.dto";
import { UpdateProductoDto } from "./dto/update-producto.dto";

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductoDto: CreateProductoDto) {
    const existe = await this.prisma.producto.findUnique({
      where: { nombre: createProductoDto.nombre },
    });

    if (existe && existe.isActive) {
      throw new NotFoundException(`El producto ${createProductoDto.nombre} ya existe.`);
    }

    if (existe && !existe.isActive) {
      // Si existe pero está inactivo, puedes restaurarlo y actualizar datos si quieres
      const productoRestaurado = await this.prisma.producto.update({
        where: { id: existe.id },
        data: { ...createProductoDto, isActive: true },
      });
      return {
        mensaje: `Producto restaurado y actualizado exitosamente`,
        data: productoRestaurado,
      };
    }

    const producto = await this.prisma.producto.create({
      data: createProductoDto,
    });

    return {
      mensaje: 'Producto creado exitosamente',
      data: producto,
    };
  }

  async getAll() {
    const productos = await this.prisma.producto.findMany({
      where: { isActive: true },
    });
    return {
      mensaje: 'Lista de productos activos',
      data: productos,
    };
  }

  async getProducto(id: number) {
    const producto = await this.prisma.producto.findUnique({
      where: { id },
    });

    if (!producto || !producto.isActive) {
      throw new NotFoundException(`Producto con id ${id} no existe o está inactivo`);
    }

    return {
      mensaje: `Producto con id ${id} encontrado`,
      data: producto,
    };
  }

  async update(id: number, dto: UpdateProductoDto) {
    await this.getProducto(id); // Verifica si existe y está activo

    const actualizado = await this.prisma.producto.update({
      where: { id },
      data: dto,
    });

    return {
      mensaje: `Producto con id ${id} actualizado correctamente`,
      data: actualizado,
    };
  }

  // Eliminación lógica
  async deactivate(id: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });

    if (!producto || !producto.isActive) {
      throw new NotFoundException('Producto no encontrado o desactivado');
    }

    await this.prisma.producto.update({
      where: { id },
      data: { isActive: false },
    });

    return {
      mensaje: `Producto con id ${id} desactivado`,
    };
  }

  // Restaurar producto
  async restore(id: number) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    if (producto.isActive) {
      return { mensaje: 'Producto ya está activo' };
    }

    const restaurado = await this.prisma.producto.update({
      where: { id },
      data: { isActive: true },
    });

    return {
      mensaje: `Producto con id ${id} restaurado exitosamente`,
      data: restaurado,
    };
  }
}
