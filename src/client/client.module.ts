import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cliente } from './entities/client.entity';
import { Mascota } from './entities/mascota.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Mascota])],
  controllers: [ClientController],
  providers: [ClientService],
  exports: [ClientService]
})
export class ClientModule {}
