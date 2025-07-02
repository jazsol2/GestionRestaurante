import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { ProductoModule } from '../producto/producto.module';
import { ClienteModule } from '../cliente/cliente.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [ProductoModule, ClienteModule,PrismaModule],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
