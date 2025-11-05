import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { Mascota } from './entities/mascota.entity';
import { Cliente } from './entities/client.entity';

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
  updateMascota(
    @Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST, }),) id: number, 
    @Body() mascota: Mascota) {
    return this.clientService.updateMascota(id, mascota);
  }

   @Patch('/:id_cliente')
  updateCliente(
    @Param('id_cliente', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST, }),) id_cliente: number, 
    @Body() cliente: Cliente) {
    return this.clientService.updateCliente(id_cliente, cliente);
  }
/*
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(+id);
  }*/
}
