import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { Turno } from 'src/turnos/entities/turno.entity';
import { Horario } from './entities/horarios.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Peluquera } from './entities/peluquera.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Peluquera, Horario, Turno])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
