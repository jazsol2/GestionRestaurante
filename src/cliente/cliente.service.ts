import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  // Crear cliente con validación de duplicado por email
  async create(createClienteDto: CreateClienteDto) {
    const clienteExistente = await this.prisma.cliente.findUnique({
      where: { email: createClienteDto.email },
    });

    if (clienteExistente) {
      throw new NotFoundException('El correo electrónico ya está registrado');
    }

    const cliente = await this.prisma.cliente.create({
      data: createClienteDto,
    });

    return {
      mensaje: 'Cliente creado exitosamente',
      data: cliente,
    };
  }

  // Obtener todos los clientes activos
  async getAll() {
    return this.prisma.cliente.findMany({
      where: { isActive: true },
    });
  }

  // Obtener cliente por ID solo si está activo
  async getById(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });

    if (!cliente || !cliente.isActive) {
      throw new NotFoundException('Cliente no encontrado o inactivo');
    }

    return cliente;
  }

  // Actualizar cliente si está activo
  async update(id: number, dto: UpdateClienteDto) {
    await this.getById(id); // Verifica existencia y estado

    return this.prisma.cliente.update({
      where: { id },
      data: dto,
    });
  }

  // Eliminación lógica (desactivar cliente)
  async desactivate(id: number) {
    await this.getById(id); // Verifica existencia y estado

    await this.prisma.cliente.update({
      where: { id },
      data: { isActive: false },
    });

    return { message: 'Cliente desactivado correctamente' };
  }

  // Restaurar cliente previamente desactivado
  async restore(id: number) {
    const cliente = await this.prisma.cliente.findUnique({ where: { id } });

    if (!cliente) {
      throw new NotFoundException('Cliente no encontrado');
    }

    if (cliente.isActive) {
      return { message: 'El cliente ya está activo' };
    }

    await this.prisma.cliente.update({
      where: { id },
      data: { isActive: true },
    });

    return { message: 'Cliente restaurado exitosamente' };
  }

  // Obtener clientes eliminados lógicamente (inactivos)
  async getAllInactive() {
    return this.prisma.cliente.findMany({
      where: { isActive: false },
    });
  }
}
