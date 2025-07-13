import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existe = await this.prisma.user.findUnique({
      where: { email: createUsuarioDto.email },
    });

    if (existe && existe.isActive) {
      throw new ConflictException('Correo electrónico ya registrado');
    }

    if (existe && !existe.isActive) {
      // Restaurar usuario inactivo y actualizar info si quieres
      const usuarioRestaurado = await this.prisma.user.update({
        where: { id: existe.id },
        data: { ...createUsuarioDto, isActive: true },
      });
      return {
        message: 'Usuario restaurado y actualizado exitosamente',
        data: usuarioRestaurado,
      };
    }

    const usuario = await this.prisma.user.create({
      data: createUsuarioDto,
    });

    return {
      message: 'Usuario creado correctamente',
      data: usuario,
    };
  }

  async findAll() {
    const usuarios = await this.prisma.user.findMany({
      where: { isActive: true },
    });
    return {
      message: 'Lista de usuarios activos',
      data: usuarios,
      where: {isActive: true},
    };
  }

  async findOne(id: number) {
    const usuario = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!usuario || !usuario.isActive) {
      throw new NotFoundException('Usuario no encontrado o está inactivo');
    }

    return {
      message: 'Usuario encontrado',
      data: usuario,
      where: {isActive: true},
    };
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id); // Verifica que exista y esté activo

<<<<<<< HEAD
    const usuarioActualizado = await this.prisma.user.update({
      where: { id },
      data: updateUsuarioDto,
=======
     const usuarioActualizado = await this.prisma.user.update({
      where:{id},
      data: updateUsuarioDto
     })
    return {
      message:'Usuario se actulizao correctamente',
      data: usuarioActualizado,
    }
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.user.update({
    where: {id},
    data: {isActive: false}
>>>>>>> e7c98beac47954687e211ed84c8c4b44131a3861
    });

    return {
      message: 'Usuario actualizado correctamente',
      data: usuarioActualizado,
    };
  }

  // Eliminación lógica
  async deactivate(id: number) {
    const usuario = await this.prisma.user.findUnique({ where: { id } });

    if (!usuario || !usuario.isActive) {
      throw new NotFoundException('Usuario no encontrado o eliminado');
    }

    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });

    return {
      message: 'Usuario desactivado',
    };
  }

  // Restaurar usuario
  async restore(id: number) {
    const usuario = await this.prisma.user.findUnique({ where: { id } });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (usuario.isActive) {
      return { message: 'Usuario ya está activo' };
    }

    const restaurado = await this.prisma.user.update({
      where: { id },
      data: { isActive: true },
    });

    return {
      message: 'Usuario restaurado correctamente',
      data: restaurado,
    };
  }
}
