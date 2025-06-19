import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Producto } from './entities/producto.entity';

@Injectable()
export class ProductosService {
  private productos: Producto[] = [];
  private contador = 1;

  getAll(): Producto[] {
    return this.productos;
  }

  getProducto(id: number): Producto {
    const producto = this.productos.find((p) => p.id === id);
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no existe`);
    }
    return producto;
  }

  createProducto(dto: CreateProductoDto): Producto {
    const nuevo: Producto = {
      id: this.contador++,
      ...dto,
    };
    this.productos.push(nuevo);
    return nuevo;
  }

  update(id: number, dto: UpdateProductoDto): Producto {
    const index = this.productos.findIndex((p) => p.id === id);
    if (index === -1) {
      throw new NotFoundException(`Producto con id ${id} no existe`);
    }
    const actualizado = { ...this.productos[index], ...dto };
    this.productos[index] = actualizado;
    return actualizado;
  }

  delete(id: number): string {
    const lengthAntes = this.productos.length;
    this.productos = this.productos.filter((p) => p.id !== id);
    if (this.productos.length === lengthAntes) {
      throw new NotFoundException(`Producto con id ${id} no existe`);
    }
    return `Producto con id ${id} eliminado correctamente`;
  }
}
