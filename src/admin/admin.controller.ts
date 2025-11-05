import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Peluquera } from './entities/peluquera.entity';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) { }

  @Get('/peluqueras')
  findAllPeluqueras() {
    return this.adminService.findAllPeluqueras();
  }

  @Get('/razas')
  async getAllRazas() {
    return this.adminService.getAllRazas();
  }

  @Post('/peluqueras')
  create(@Body() newPeluquera: Peluquera) {
    return this.adminService.createPeluquera(newPeluquera);
  }

  @Put('/peluqueras/:id_peluquera')
  update(@Param('id_peluquera') id: string, @Body() updatePeluqueraDto: Peluquera) {
    return this.adminService.updatePeluquera(+id, updatePeluqueraDto);
  }

 /* @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }*/
}
