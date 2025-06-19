import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductosService } from './producto.service';
import { ProductoController } from './producto.controller';
import { Producto } from './entities/producto.entity';

@Module({
  /*imports: [TypeOrmModule.forFeature([Producto])],*/
  controllers: [ProductoController],
  providers: [ProductosService],
  exports: [ProductosService],
})
export class ProductoModule {}
