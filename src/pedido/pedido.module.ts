import { Module } from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { ProductoModule } from '../producto/producto.module';
import { ClienteModule } from '../cliente/cliente.module';

@Module({
  imports: [ProductoModule, ClienteModule],
  controllers: [PedidoController],
  providers: [PedidoService],
})
export class PedidoModule {}
