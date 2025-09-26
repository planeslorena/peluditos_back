import { Injectable } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Horario } from 'src/admin/entities/horarios.entity';

@Injectable()
export class TurnosService {

  constructor(
    @InjectRepository(Turno)
    private turnosRepository: Repository<Turno>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
  ) {}

  async getTurnosDisponibles(day: string): Promise<Horario[]> {
    // 0 (Domingo) a 6 (Sábado)
    const diaDeLaSemana = moment(day, 'YYYY-MM-DD').day();
    const dia = moment(day, 'YYYY-MM-DD').format('YYYY-MM-DD');
    
    //Traer los horarios de las peluqueras para el día de la semana especificado
    const horarios = await this.horarioRepository.find({
      where: { dia: diaDeLaSemana },
      relations: ['peluquera'],  
      order: { horario: 'ASC' }
    });

    //Traer los turnos ya ocupados para el día especificado
    const turnosOcupados = await this.turnosRepository.find({
      where: { dia: dia },
      relations: ['peluquera']  
    });

    //Filtra los horarios ya ocupados para cada peluquera y asi obtiene los turnos disponibles
    const turnosDisponibles = horarios.filter(horario => {
      return !turnosOcupados.some(turno => {
        return turno.hora === horario.horario && turno.peluquera.id_peluquera === horario.peluquera.id_peluquera;
      });
    });

    return turnosDisponibles;
  }

  async getDiasNoDisponibles(day: string): Promise<boolean> {
    const horariosDisponibles = await this.getTurnosDisponibles(day);
    const diaNoDisponible = horariosDisponibles.length === 0;
    return diaNoDisponible;
  }

  create(newTurno: Turno) {
    const turno = {
      ...newTurno,
      dia: moment(newTurno.dia, 'YYYY-MM-DD').format('YYYY-MM-DD'),
    }
    const createdTurno = this.turnosRepository.create(turno);
    return this.turnosRepository.save(createdTurno);
  }
/*
  findAll() {
    return this.turnosRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} turno`;
  }

  update(id: number, updateTurnoDto: UpdateTurnoDto) {
    return `This action updates a #${id} turno`;
  }

  remove(id: number) {
    return `This action removes a #${id} turno`;
  }*/
}
