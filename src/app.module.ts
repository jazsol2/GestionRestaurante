import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <- ¡Esto es obligatorio!
import { ProductoModule } from './producto/producto.module';
import { ClienteModule } from './cliente/cliente.module';
import { PedidoModule } from './pedido/pedido.module';
import { UsuarioModule } from './usuario/usuario.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [ProductoModule, ClienteModule, PedidoModule, UsuarioModule, PrismaModule],
})
export class AppModule {}
