import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, HttpStatus } from '@nestjs/common';
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

  @Get('/turnosPorDia/:day')
  async getTurnosPorDia(
    @Param('day') day: string,
  ) {
    return this.turnosService.turnosDelDia(day);
  }

  @Post()
  create(@Body() newTurno: Turno) {
    return this.turnosService.create(newTurno);
  }

  @Delete(':id_turno')
  async delete(
    @Param('id_turno', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST, })) id_turno: number): Promise<void> {
    this.turnosService.delete(id_turno);
  }


}
