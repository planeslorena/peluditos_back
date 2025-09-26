import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TurnosService } from './turnos.service';
import { CreateTurnoDto } from './dto/create-turno.dto';
import { UpdateTurnoDto } from './dto/update-turno.dto';
import { Turno } from './entities/turno.entity';

@Controller('turnos')
export class TurnosController {
  constructor(private readonly turnosService: TurnosService) { }

  @Get('/turnosDisponibles')
  async getTurnosDisponibles(
    @Query('day') day: string,
  ) {
    return this.turnosService.getTurnosDisponibles(day);
  }

  @Get('/diasNoDisponibles')
  async getDiasNoDisponibles(
    @Query('day') day: string,
  ) {
    return this.turnosService.getDiasNoDisponibles(day);
  }

  @Post()
  create(@Body() newTurno: Turno) {
    return this.turnosService.create(newTurno);
  }



  /*
  @Get()
  findAll() {
    return this.turnosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.turnosService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTurnoDto: UpdateTurnoDto) {
    return this.turnosService.update(+id, updateTurnoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.turnosService.remove(+id);
  }*/
}
