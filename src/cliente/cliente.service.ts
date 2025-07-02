import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { Cliente } from './entities/cliente.entity';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ClientesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClienteDto: CreateClienteDto) {
    // verificacion de cliente exixtente
  const clienteExistente = await this.prisma.cliente.findUnique({
    where: {
      email: createClienteDto.email,
    },
  });

  if (clienteExistente) {
    throw new NotFoundException('El correo electrónico ya está registrado');
  }

  // Crear el nuevo cliente si no hay duplicados
  const cliente = await this.prisma.cliente.create({
    data: createClienteDto,
  });

  return {
    mensaje: 'Cliente creado exitosamente',
    data: cliente,
  };
  }

  async getAll() {
    return this.prisma.cliente.findMany() ;
  }

  async getById(id: number) {
    const cliente = await this.prisma.cliente.findUnique({
      where: { id },  
    });
    if (!cliente) throw new NotFoundException('Cliente no encontrado');
    return cliente;
  }

 

  async update(id: number, dto: UpdateClienteDto) {
    await this.getById(id); // Verifica si el cliente existe

    return this.prisma.cliente.update({
      where: { id },  
      data: dto,
    });
  }

  async remove(id: number) {
    await this.getById(id); // Verifica si el cliente existe
    return this.prisma.cliente.delete({
      where: { id },  
    });
    return { deleted: true, message: 'Cliente eliminado correctamente'};
  }
}
