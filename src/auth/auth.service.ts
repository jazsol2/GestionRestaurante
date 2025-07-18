import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) throw new UnauthorizedException('Correo no registrado');

    if (user.password !== loginDto.password) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return {
      message: 'Login exitoso',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
