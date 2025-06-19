import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <- ¡Esto es obligatorio!
import { ProductoModule } from './producto/producto.module';
import { ClienteModule } from './cliente/cliente.module';
import { PedidoModule } from './pedido/pedido.module';

@Module({
  imports: [ProductoModule, ClienteModule, PedidoModule],
})
export class AppModule {}
