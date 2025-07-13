import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { ClientesService } from '../cliente/cliente.service';
import { ProductosService } from '../producto/producto.service';

@Injectable()
export class PedidoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clienteService: ClientesService,
    private readonly productoService: ProductosService,
  ) {}

  async create(createPedidoDto: CreatePedidoDto) {
    const cliente = await this.clienteService.getById(createPedidoDto.clienteId);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    let total = 0;
    const detalles = [];

    if (
      !Array.isArray(createPedidoDto.productos) ||
      createPedidoDto.productos.length === 0 ||
      createPedidoDto.productos.some(p => p == null)
    ) {
      throw new NotFoundException('Lista de productos inválida o contiene valores nulos');
    }

    for (const item of createPedidoDto.productos) {
      const productoId = typeof item === 'object' ? item.productoId : item;
      const cantidad = typeof item === 'object' && item.cantidad ? item.cantidad : 1;

      const producto = await this.productoService.getProducto(productoId);
      if (!producto) {
        throw new NotFoundException(`Producto con id ${productoId} no existe`);
      }

      if (cantidad <= 0 || cantidad > 100) {
        throw new NotFoundException(`Cantidad inválida para el producto ${productoId}`);
      }

      if (producto.data.stock < cantidad) {
        throw new NotFoundException(`Stock insuficiente para producto ${productoId}`);
      }

      total += producto.data.precio * cantidad;

      detalles.push({
        productoId,
        cantidad,
      });
    }

    // Crear el pedido con sus detalles
    const pedido = await this.prisma.pedido.create({
      data: {
        clienteId: createPedidoDto.clienteId,
        total,
        estado: 'pendiente',
        isActive: true,
        detalles: {
          create: detalles,
        },
      },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });

    return {
      mensaje: 'Pedido creado exitosamente',
      data: pedido,
    };
  }

  // Obtener todos los pedidos activos
  async getAll() {
    return this.prisma.pedido.findMany({
      where: { isActive: true },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
          where:{isActive: true}
        },
      },
    });
  }

  // Obtener pedido por id solo si está activo
  async getPedido(id: number) {
    const pedido = await this.prisma.pedido.findUnique({
      where: { id, isActive: true },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });

    if (!pedido || !pedido.isActive) {
      throw new NotFoundException(`Pedido con id ${id} no encontrado o está inactivo`);
    }

    return {
      message: 'Pedido encontrado',
      data: pedido,
    };
  }

  // Actualizar estado del pedido
  async updateEstado(id: number, nuevoEstado: string) {
    const pedidoExistente = await this.getPedido(id); // Verificar si existe y está activo

    const pedidoActualizado = await this.prisma.pedido.update({
      where: { id },
      data: { estado: nuevoEstado },
      include: {
        cliente: true,
        detalles: {
          include: {
            producto: true,
          },
        },
      },
    });

    return {
      mensaje: 'Estado del pedido actualizado correctamente',
      data: pedidoActualizado,
    };
  }

<<<<<<< HEAD
  // Eliminación lógica del pedido (desactivar)
  async deactivate(id: number) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });

    if (!pedido || !pedido.isActive) {
      throw new NotFoundException('Pedido no encontrado o ya eliminado');
    }

    await this.prisma.pedido.update({
      where: { id },
      data: { isActive: false, estado: 'cancelado' },
    });

=======
  // Eliminar pedido
  async delete(id: number) {
    const pedido = await this.getPedido(id); // Verificar si existe
    
    await this.prisma.pedidoDetalle.updateMany({
      where: { pedidoId: id },
      data: {isActive: false}
    });

    await this.prisma.pedido.update({ 
      where: { id },
      data:{isActive: false}
     });
>>>>>>> e7c98beac47954687e211ed84c8c4b44131a3861
    return {
      message: 'Pedido cancelado (eliminado lógicamente)',
      data: pedido,
    };
  }

  // Restaurar pedido eliminado lógicamente
  async restore(id: number) {
    const pedido = await this.prisma.pedido.findUnique({ where: { id } });

    if (!pedido) {
      throw new NotFoundException('Pedido no encontrado');
    }

    if (pedido.isActive) {
      return { message: 'El pedido ya está activo' };
    }

    const restored = await this.prisma.pedido.update({
      where: { id },
      data: { isActive: true, estado: 'pendiente' },
    });

    return {
      message: 'Pedido restaurado correctamente',
      data: restored,
    };
  }
}
