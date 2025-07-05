import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsuarioService {
  constructor(private prisma: PrismaService) {} 
  
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario>   {
    const existe = await this.prisma.user.findUnique({
      where:{email: createUsuarioDto.email},
    });
    
    if (existe){
      throw new ConflictException('Correo electronico ya registrado')
    }

    const usuario = await this.prisma.user.create({
      data: createUsuarioDto,
    });

    return {
      message: 'Usuario se creo correctamente',
      data: usuario,
    };
  }

  async findAll() {
    const usuarios = await this.prisma.user.findMany();
    return {
      message: 'Lista encontrada',
      data: usuarios,
      where: {isActive: true},
    };
  }

  async findOne(id: number) {
    const usuario = await this.prisma.user.findUnique({
      where:{id},
    });

    if(!usuario){
      throw new NotFoundException ('Usuario no encontrado');
    }
    return {
      message: 'Usuario encontrado',
      data: usuario,
      where: {isActive: true},
    };
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    await this.findOne(id);

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
    });

   return{
    message: 'Se elimino el usuario correctamente',
   };
  }
}
