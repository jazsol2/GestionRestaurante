import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {}

  // Crear usuario (con hash de contraseña)
  async create(createUsuarioDto: CreateUsuarioDto) {
    const existe = await this.prisma.user.findUnique({
      where: { email: createUsuarioDto.email },
    });

    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, 10);

    if (existe && existe.isActive) {
      throw new ConflictException('Correo electrónico ya registrado');
    }

    if (existe && !existe.isActive) {
      const usuarioRestaurado = await this.prisma.user.update({
        where: { id: existe.id },
        data: {
          ...createUsuarioDto,
          password: hashedPassword,
          isActive: true,
        },
      });
      return {
        message: 'Usuario restaurado y actualizado exitosamente',
        data: usuarioRestaurado,
      };
    }

    const usuario = await this.prisma.user.create({
      data: {
        ...createUsuarioDto,
        password: hashedPassword,
      },
    });

    return {
      message: 'Usuario creado correctamente',
      data: usuario,
    };
  }

  // Listar usuarios activos
  async findAll() {
    const usuarios = await this.prisma.user.findMany({
      where: { isActive: true },
    });
    return {
      message: 'Lista de usuarios activos',
      data: usuarios,
    };
  }

  // Buscar un usuario por ID
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
    };
  }

  // Actualizar usuario
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id); // Verifica existencia

    const usuarioActualizado = await this.prisma.user.update({
      where: { id },
      data: updateUsuarioDto,
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
