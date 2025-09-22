import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Mascota } from './entities/mascota.entity';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) { }

  //Trae los datos del cliente por DNI
  @Post('/login')
  async login(@Body() body: {dni: number}) {
    return this.clientService.getClientbyDni(body.dni);
  }

  @Get('/mascotas/:dni')
  async getMascotas(@Param('dni') dni: string) {
    return this.clientService.getMascotasByClientDni(+dni);
  }

  @Post()
  async create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto);
  }

  @Post('/mascotas')
  async createMascota(@Body() mascota: Mascota) {
    return this.clientService.createMascota(mascota);
  }
/*
  @Get()
  findAll() {
    return this.clientService.findAll();
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(+id, updateClientDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }*/
}
