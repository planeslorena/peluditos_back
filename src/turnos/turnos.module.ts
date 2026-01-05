import { Module } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Turno } from './entities/turno.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from 'src/admin/entities/horarios.entity';
import { ClientService } from 'src/client/client.service';
import { ClientModule } from 'src/client/client.module';
import { WhatsappModule } from 'src/whatsapp/whatsapp.module';
import { AdminService } from 'src/admin/admin.service';
import { AdminModule } from 'src/admin/admin.module';
import { TurnoDeshabilitado } from './entities/turnosDeshabilitados.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Turno, Horario, TurnoDeshabilitado]), ClientModule, WhatsappModule, AdminModule],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService]
})
export class TurnosModule {}
