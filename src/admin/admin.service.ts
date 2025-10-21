import { Injectable } from '@nestjs/common';
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
  /*create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }
*/
  findAllPeluqueras() {
    return this.peluqueraRepository.find({ relations: ['horarios'] });
  }
/*
  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }*/

  async getAllRazas(): Promise<Raza[]> {
    const razas = await this.razaRepository.find();
    return razas;
  }

  async getPeluqueraById(id: number): Promise<Peluquera> {
    const peluquera = await this.peluqueraRepository.findOne({ where: { id_peluquera: id } });
    return peluquera;
  }
}