import { Injectable, NotFoundException } from '@nestjs/common';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { v4 as uuid } from 'uuid';
import { ProductosService } from '../producto/producto.service';
import { ClientesService } from '../cliente/cliente.service';

@Injectable()
export class PedidoService {
  private pedidos: Pedido[] = [];

  constructor(
    private readonly productoService: ProductosService,
    private readonly clienteService: ClientesService,
  ) {}

  async create(dto: CreatePedidoDto): Promise<Pedido> {
    const cliente = await this.clienteService.getById(dto.clienteId);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');

    let total = 0;
    for (const item of dto.productos) {
      const producto = await this.productoService.getProducto(item.productoId);
      if (!producto)
        throw new NotFoundException(
          `Producto con id ${item.productoId} no existe`,
        );
      total += producto.precio * item.cantidad;
    }

    const nuevoId =
      this.pedidos.length > 0
        ? this.pedidos[this.pedidos.length - 1].id + 1
        : 1;

    const pedido: Pedido = {
      id: nuevoId,
      clienteId: dto.clienteId,
      productos: dto.productos,
      total,
      fecha: new Date().toISOString(),
      estado: 'pendiente',
    };

    this.pedidos.push(pedido);
    return pedido;
  }

  getAll(): Pedido[] {
    return this.pedidos;
  }

  getPedido(id: number): Pedido {
    const pedido = this.pedidos.find((p) => p.id === id);
    if (!pedido) throw new NotFoundException('Pedido no encontrado');
    return pedido;
  }

  updateEstado(id: number, nuevoEstado: Pedido['estado']): Pedido {
    const pedido = this.getPedido(id);
    pedido.estado = nuevoEstado;
    return pedido;
  }
}
