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

  async getClientByIdMascota(id_mascota: number): Promise<Mascota> {
    const mascota = await this.mascotaRepository.findOne({
      where: { id_mascota: id_mascota },
      relations: ['duenio'],
    });

    return mascota ? mascota : null;
  }

  async getAll(): Promise<Cliente[]> {
    try {
      const clientes = await this.clienteRepository.find({ relations: ['mascotas'] });
      return clientes;
    } catch (error) {
      throw new HttpException(
        `Error trayendo clientes: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getAllMascotas(): Promise<Mascota[]> {
    try {
      const mascotas = await this.mascotaRepository.find({ relations: ['duenio'] });
      return mascotas;
    } catch (error) {
      throw new HttpException(
        `Error trayendo mascotas: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateMascota(id: number, mascota: Mascota) {
    try {
      await this.mascotaRepository.update(id, mascota);
      const updatedMascota = await this.mascotaRepository.findOneBy({ id_mascota: id });
      return updatedMascota;
    } catch (error) {
      throw new HttpException(
        `Error actualizando mascota: ${error.sqlMessage}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateCliente(id_cliente: number, cliente: Cliente) {
    try {
      await this.clienteRepository.update(id_cliente, cliente);
      const updatedCliente = await this.clienteRepository.findOneBy({ id_cliente: id_cliente });
      if (!updatedCliente) {
        throw new HttpException(
          `Cliente con id ${id_cliente} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedCliente;
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
