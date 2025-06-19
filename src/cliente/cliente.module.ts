import { Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClientesService } from './cliente.service';

@Module({
  controllers: [ClienteController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClienteModule {}
