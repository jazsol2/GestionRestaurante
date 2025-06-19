import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';

@Injectable()
export class ClientesService {
  private clientes: Cliente[] = [];
  private contador = 1;

  create(createClienteDto: CreateClienteDto): Cliente {
    const nuevoCliente: Cliente = {
      id: this.contador++,
      ...createClienteDto,
    };
    this.clientes.push(nuevoCliente);
    return nuevoCliente;
  }

  getAll(): Cliente[] {
    return this.clientes;
  }

  getById(id: number): Cliente {
    const cliente = this.clientes.find((c) => c.id === id);
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

  update(id: number, dto: UpdateClienteDto): Cliente {
    const index = this.clientes.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException('Cliente no encontrado');
    this.clientes[index] = { ...this.clientes[index], ...dto };
    return this.clientes[index];
  }

  remove(id: number) {
    const cantidadAntes = this.clientes.length;
    this.clientes = this.clientes.filter((c) => c.id !== id);
    return { deleted: this.clientes.length < cantidadAntes };
  }
}
