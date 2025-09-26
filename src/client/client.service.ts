import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entities/client.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Mascota } from './entities/mascota.entity';

@Injectable()
export class ClientService {

  constructor(
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(Mascota)
    private readonly mascotaRepository: Repository<Mascota>
  ) { }

  async create(createClientDto: CreateClientDto) {
    try {
      const cliente = this.clienteRepository.create(createClientDto);
      return await this.clienteRepository.insert(cliente);
    } catch (error) {
      //Si la DB retorna el error 1062 quiere decir que el dni ya existe en la misma
      if (error.errno == 1062) {
        throw new HttpException(
          'El dni ya esta siendo utilizado por un usuario',
          HttpStatus.CONFLICT,
        );
      }
      throw new HttpException(
        `Error insertando usuario: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  findAll() {
    return `This action returns all client`;
  }

  async createMascota(mascota: Mascota) {
    try {
      const nuevaMascota = this.mascotaRepository.create(mascota);
      return await this.mascotaRepository.insert(nuevaMascota);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        `Error insertando mascota: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getClientbyDni(dni: number) {

    const cliente = await this.clienteRepository.findOneBy({ dni: dni, },);

    return cliente;
  }

  async getMascotasByClientDni(dni: number): Promise<Mascota[]> {
    const mascotas = await this.mascotaRepository.find({
      where: { duenio: { dni: dni } },
    });

    return mascotas ? mascotas : [];
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
