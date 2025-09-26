import { Module } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { TurnosController } from './turnos.controller';
import { Turno } from './entities/turno.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Horario } from 'src/admin/entities/horarios.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Turno, Horario])],
  controllers: [TurnosController],
  providers: [TurnosService],
  exports: [TurnosService]
})
export class TurnosModule {}
