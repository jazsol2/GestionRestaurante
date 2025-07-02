import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {} 
  
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>   {
    console.log('DTO recibido:', createUsuarioDto);
    
    const usuario = await this.prisma.user.create({
      data: {
        ...createUsuarioDto,
      },
    });
    return usuario;
  }

  async findAll(): Promise<Usuario[]> {
    const usuarios = await this.prisma.user.findMany();
    return usuarios;
  }

  findOne(id: number) {
    return `This action returns a #${id} usuario`;
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return `This action updates a #${id} usuario`;
  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
