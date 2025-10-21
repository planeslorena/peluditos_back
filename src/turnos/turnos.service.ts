import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Turno } from './entities/turno.entity';
import { Repository } from 'typeorm';
import * as moment from 'moment';
import { Horario } from 'src/admin/entities/horarios.entity';
import { ClientService } from 'src/client/client.service';
import { WhatsappService } from 'src/whatsapp/whatsapp.service';
import { AdminService } from 'src/admin/admin.service';
import { Cron } from "@nestjs/schedule";

@Injectable()
export class TurnosService {
  private readonly logger = new Logger(TurnosService.name);

  constructor(
    @InjectRepository(Turno)
    private turnosRepository: Repository<Turno>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    private readonly clientService: ClientService,
    private readonly whatsappService: WhatsappService,
    private readonly adminService: AdminService,
  ) { }

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

  //Devuelve true si no hay turnos disponibles para el día especificado
  async getDiasNoDisponibles(day: string): Promise<boolean> {
    const horariosDisponibles = await this.getTurnosDisponibles(day);
    const diaNoDisponible = horariosDisponibles.length === 0;
    return diaNoDisponible;
  }

  //Guarda el turno y envia el mensaje de whatsapp
  async create(newTurno: Turno) {
    try {
      const turno = {
        ...newTurno,
        dia: moment(newTurno.dia, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      };
      const createdTurno = this.turnosRepository.create(turno);
      const savedTurno = await this.turnosRepository.save(createdTurno);
    } catch (error) {
      throw new HttpException(
        `Error creando turno: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const mascotaCliente = await this.clientService.getClientByIdMascota(newTurno.mascota.id_mascota);

    const peluquera = await this.adminService.getPeluqueraById(newTurno.peluquera.id_peluquera);
    const newTurnoComplete = {
      ...newTurno,
      mascota: mascotaCliente,
      peluquera: peluquera
    };

    this.whatsappService.prepareMessage(mascotaCliente, newTurnoComplete)
      .then(message => this.whatsappService.sendMessage(message))
      .then(response => {
        console.log('WhatsApp message sent successfully:', response);
      })
      .catch(error => {
        console.error('Error sending WhatsApp message:', error);
      });

  }

  //Devuelve los turnos del día especificado
  async turnosDelDia(dia: string): Promise<Turno[]> {
    const turnos = await this.turnosRepository.find({
      where: { dia: dia },
      relations: ['mascota', 'mascota.duenio', 'peluquera'],
      order: { hora: 'ASC' }
    });
    return turnos;
  }

  //Programa tarea para enviar whatsapp de recordatorio de turno un día antes
  @Cron('0 0 17 * * 1-7')
  async recordarTurnos() {
    this.logger.log('Tarea de recordatorio de turnos iniciada');
    //Lógica para obtener los turnos del día siguiente
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    const turnos= await this.turnosDelDia(tomorrow);
    //Enviar recordatorio por cada turno
    turnos.forEach(turno => {
      this.whatsappService.prepareMessage(turno.mascota, turno)
        .then(message => this.whatsappService.sendMessage(message))
        .then(response => {
          console.log('WhatsApp message sent successfully:', response);
        })
        .catch(error => {
          console.error('Error sending WhatsApp message:', error);
        });
    });
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
