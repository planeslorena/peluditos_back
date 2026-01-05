import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Peluquera } from './entities/peluquera.entity';
import { Horario } from './entities/horarios.entity';
import { Repository } from 'typeorm';
import { Turno } from 'src/turnos/entities/turno.entity';
import * as moment from 'moment';
import { Raza } from './entities/razas.entity';

@Injectable()
export class AdminService {

  constructor(
    @InjectRepository(Peluquera)
    private readonly peluqueraRepository: Repository<Peluquera>,
    @InjectRepository(Horario)
    private readonly horarioRepository: Repository<Horario>,
    @InjectRepository(Raza)
    private readonly razaRepository: Repository<Raza>,
  ) { }

  async findAllPeluqueras() {
    return await this.peluqueraRepository.find({ 
      relations: ['horarios'],
      order: { horarios: { dia: 'ASC', horario: 'ASC' } }
    });
  }

  async getAllRazas(): Promise<Raza[]> {
    const razas = await this.razaRepository.find({
      order: { raza: 'ASC' }
    });
    return razas;
  }

  async getPeluqueraById(id: number): Promise<Peluquera> {
    const peluquera = await this.peluqueraRepository.findOne({ where: { id_peluquera: id } });
    return peluquera;
  }

  async createPeluquera(newPeluquera: Peluquera): Promise<Peluquera> {
    try {
      const peluquera = this.peluqueraRepository.create(newPeluquera);
      const peluqueraGuardada = await this.peluqueraRepository.save(peluquera);

      const horariosGuardados = await Promise.all(
        newPeluquera.horarios.map(horario => {
          const nuevoHorario = this.horarioRepository.create({
            dia: horario.dia,
            horario: horario.horario,
            peluquera: peluqueraGuardada,
          });
          return this.horarioRepository.save(nuevoHorario);
        })
      );

      return {
        ...peluqueraGuardada, horarios: horariosGuardados
      };
    } catch (error) {
      if (error.errno == 1062) {
        throw new HttpException(
          'El dni ya esta siendo utilizado por un profesional',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    }
  }

  async updatePeluquera(id_peluquera: number, peluquera: Peluquera) {
    try {
      const datosPeluquera = {
        id_peluquera: peluquera.id_peluquera,
        nombre: peluquera.nombre,
        dni: peluquera.dni,
        telefono: peluquera.telefono,
      };

      await this.peluqueraRepository.update(id_peluquera, datosPeluquera);
      const updatedPeluquera = await this.peluqueraRepository.findOneBy({ id_peluquera: id_peluquera });
      if (!updatedPeluquera) {
        throw new HttpException(
          `Peluquera con id ${id_peluquera} no encontrada`,
          HttpStatus.NOT_FOUND,
        );
      }

      await this.horarioRepository.delete({ peluquera: { id_peluquera } });

      const horariosNuevos = await Promise.all(
        peluquera.horarios.map(horario => {
          const nuevoHorario = this.horarioRepository.create({
            dia: horario.dia,
            horario: horario.horario,
            peluquera: updatedPeluquera,
          });
          return this.horarioRepository.save(nuevoHorario);
        })
      );
      updatedPeluquera.horarios = horariosNuevos;
      return updatedPeluquera;

    } catch (error) {
      if (error.errno == 1062) {
        throw new HttpException(
          'El dni ya esta siendo utilizado por un usuario',
          HttpStatus.CONFLICT,
        );
      } else {
        throw error;
      }
    }
  }

}