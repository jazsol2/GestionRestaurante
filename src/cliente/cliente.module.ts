import { Module } from '@nestjs/common';
import { ClienteController } from './cliente.controller';
import { ClientesService } from './cliente.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ClienteController],
  providers: [ClientesService],
  exports: [ClientesService],
})
export class ClienteModule {}
