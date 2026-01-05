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
import { TurnoDeshabilitado } from './entities/turnosDeshabilitados.entity';

@Injectable()
export class TurnosService {
  private readonly logger = new Logger(TurnosService.name);

  constructor(
    @InjectRepository(Turno)
    private turnosRepository: Repository<Turno>,
    @InjectRepository(Horario)
    private horarioRepository: Repository<Horario>,
    @InjectRepository(TurnoDeshabilitado)
    private turnoDeshabilitadoRepository: Repository<TurnoDeshabilitado>,
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
    const turnosFiltrados = horarios.filter(horario => {
      return !turnosOcupados.some(turno => {
        return turno.hora === horario.horario && turno.peluquera.id_peluquera === horario.peluquera.id_peluquera;
      });
    });

    //Trae los turnos deshabilitados para el día especificado
    const turnosDeshabilitados = await this.turnoDeshabilitadoRepository.find({
      where: { dia: dia },
      relations: ['peluquera']
    });

    //Filtra los turnos deshabilitados para cada peluquera
    const turnosDisponibles = turnosFiltrados.filter(horario => {
      return !turnosDeshabilitados.some(turnoDeshabilitado => {
        return turnoDeshabilitado.hora === horario.horario && turnoDeshabilitado.peluquera.id_peluquera === horario.peluquera.id_peluquera;
      });
    });
    return turnosDisponibles;
  }

  //Devuelve los días NO disponibles dentro de un rango de fechas
  async getDiasNoDisponiblesRango(fechaInicio: string, fechaFin: string): Promise<string[]> {
    const diasNoDisponibles: string[] = [];

    let current = moment(fechaInicio);
    const end = moment(fechaFin);

    while (current <= end) {
      const day = current.format('YYYY-MM-DD');
      const horariosDisponibles = await this.getTurnosDisponibles(day);

      if (horariosDisponibles.length === 0) {
        diasNoDisponibles.push(day);
      }

      current = current.add(1, 'day');
    }

    return diasNoDisponibles;
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

    //Suspención de envio de whatsapp de confirmación a pedido del cliente (02/01/2026)
    /*
    try {
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
    } catch (error) {
      throw new HttpException(
        `Turno creado, no se pudo enviar whatsapp: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }*/

    this.deshabilitarTurnosSolapados(
      newTurno.peluquera.id_peluquera,
      moment(newTurno.dia, 'YYYY-MM-DD').format('YYYY-MM-DD'),
      newTurno.hora,
      60
    );
  }

  horaAminutos(hora: string): number {
    const [h, m] = hora.split(':').map(Number);
    return h * 60 + m;
  }

  //Deshabilita turnos que se solapan
  async deshabilitarTurnosSolapados(
    peluqueraId: number,
    dia: string,
    horaReservada: string, // "07:00"
    duracionMinutos = 60,
  ) {
    const inicio = this.horaAminutos(horaReservada);
    const fin = inicio + duracionMinutos;
    const anteriores = inicio - duracionMinutos;
    const diaSemana = moment(dia, 'YYYY-MM-DD').day();

    // 1. Traer todos los horarios de esa peluquera y día
    const horarios = await this.horarioRepository.find({
      where: {
        dia: diaSemana,
        peluquera: { id_peluquera: peluqueraId },
      },
      relations: ['peluquera'],
    });

    // 2. Filtrar los que se solapan
    const horariosADeshabilitar = horarios.filter((h) => {
      const horaMin = this.horaAminutos(h.horario);

      return (
        (horaMin > inicio && // no incluir el turno reservado
          horaMin <= fin) ||
        (horaMin >= anteriores && // turno anterior
          horaMin < inicio)
      );
    });

    // 3. Guardarlos como turnos deshabilitados
    const turnosDeshabilitados = horariosADeshabilitar.map((h) => {
      const td = new TurnoDeshabilitado(
        dia.toString(),
        h.horario,
      );
      td.peluquera = h.peluquera;
      return td;
    });

    await this.turnoDeshabilitadoRepository.upsert(
      turnosDeshabilitados,
      ['dia', 'hora', 'peluquera'],
    );
  }

  //Deshabilita un turno específico
  async deshabilitarTurno(
    turno: TurnoDeshabilitado,
  ) {
    const td = new TurnoDeshabilitado(
      turno.dia,
      turno.hora,
    );
    td.peluquera = await this.adminService.getPeluqueraById(turno.peluquera.id_peluquera);
    console.log('Deshabilitando turno:', td);
    await this.turnoDeshabilitadoRepository.upsert(
      td,
      ['dia', 'hora', 'peluquera'],
    );
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

  //Devuelve los dias y horarios deshabilitados
  async getTurnosDeshabilitados(dia: string): Promise<TurnoDeshabilitado[]> {
    const turnosDeshabilitados = await this.turnoDeshabilitadoRepository.find({
      where: { dia: dia },
      relations: ['peluquera']
    });
    return turnosDeshabilitados;
  }

  //Programa tarea para enviar whatsapp de recordatorio de turno un día antes
  @Cron('0 0 17 * * 1-7')
  async recordarTurnos() {
    this.logger.log('Tarea de recordatorio de turnos iniciada');
    //Lógica para obtener los turnos del día siguiente
    const tomorrow = moment().add(1, 'day').format('YYYY-MM-DD');
    const turnos = await this.turnosDelDia(tomorrow);
    //Enviar recordatorio por cada turno
    turnos.forEach(turno => {
      this.whatsappService.prepareMessageRecordatorio(turno.mascota, turno)
        .then(message => this.whatsappService.sendMessage(message))
        .then(response => {
          console.log('WhatsApp message sent successfully:', response);
        })
        .catch(error => {
          console.error('Error sending WhatsApp message:', error);
        });
    });
  }

  async delete(id_turno: number): Promise<void> {
    try {
      await this.turnosRepository.delete(id_turno);
    } catch (error) {
      throw new HttpException(
        `Error eliminando turno: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
