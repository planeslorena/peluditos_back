import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus } from '@nestjs/common';
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

  @Get('/mascotas')
  async getAllMascotas() {
    return this.clientService.getAllMascotas();
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

  @Get()
  async getAll() {
    return await this.clientService.getAll();
  }

  @Patch('/mascotas/:id')
  update(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST, }),) id: number, 
    @Body() mascota: Mascota) {
    return this.clientService.updateMascota(id, mascota);
  }
/*
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }*/
}
