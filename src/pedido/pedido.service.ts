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
      detalles: {
        create: detalles, // Prisma creará todos los registros en PedidoDetalle
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

// Obtener todos los pedidos con detalles y cliente
  async getAll() {
    return this.prisma.pedido.findMany({
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

  // Obtener un pedido por id con detalles y cliente
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

    if (!pedido) throw new NotFoundException(`Pedido con ${id} no encontrado`);
    return {
      message:'Pedido encontrado',
      data: pedido,
    };
  }

  // Actualizar estado del pedido
  async updateEstado(id: number, nuevoEstado: string) {
    const pedidoExistente = await this.getPedido(id); // Verificar si existe
    const pedidoActualizado = await this.prisma.pedido.update({
      where: { id },
      data: { estado: nuevoEstado },
      include: {
        cliente: true,
        detalles:{
          include:{
            producto: true,
          },
        },
      },
    });
    return  {
    mensaje: 'Estado del pedido actualizado correctamente',
    data: pedidoActualizado,
  };
  }

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
    return {
      message: 'Pedido eliminado correctamente',
      data: pedido,
    };
  } catch (error) {
    console.error(' Error al eliminar pedido:', error);
    throw new InternalServerErrorException('No se pudo eliminar el pedido');
  }
}
