import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Peluquera } from './entities/peluquera.entity';
import { Horario } from './entities/horarios.entity';
import { Repository } from 'typeorm';
import { Turno } from 'src/turnos/entities/turno.entity';
import * as moment from 'moment';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Peluquera)
    private readonly peluqueraRepository: Repository<Peluquera>,
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
    @InjectRepository(Turno)
    private readonly turnoRepository: Repository<Turno>,
  ) { }
  /*create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }*/

  async getTurnosDisponibles(day: string): Promise<Horario[]> {
    // 0 (Domingo) a 6 (Sábado)
    const diaDeLaSemana = moment(day, 'YYYY-MM-DD').day();
    
    //Traer los horarios de las peluqueras para el día de la semana especificado
    const horarios = await this.horarioRepository.find({
      where: { dia: diaDeLaSemana },
      relations: ['peluquera'],  
      order: { horario: 'ASC' }
    });

    //Traer los turnos ya ocupados para el día especificado
    const turnosOcupados = await this.turnoRepository.find({
      where: { dia: day },
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
}

  
