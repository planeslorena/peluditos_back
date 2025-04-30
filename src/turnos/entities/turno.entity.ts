import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Mascota } from 'src/client/entities/mascota.entity';
import { Peluquera } from 'src/admin/entities/peluquera.entity';

@Entity('turnos')
export class Turno {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_turno: number;

  @Column({
    name: 'diahora',
    type: 'datetime',
  })
  public diahora: Date;


  @ManyToOne(() => Mascota, (mascota) => mascota.turnos)
  public mascota: Mascota;

  @ManyToOne(() => Peluquera, (peluquera) => peluquera.turnos)
  public peluquera: Peluquera;

  constructor(diahora:Date) {
    this.diahora = diahora;
  }


}