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
    name: 'dia',
    type: 'varchar',
    nullable: false,
  })
  public dia: string;

  @Column({
    name: 'hora',
    type: 'varchar',
    nullable: false,
  })
  public hora: string;

  @ManyToOne(() => Mascota, (mascota) => mascota.turnos)
  public mascota: Mascota;

  @ManyToOne(() => Peluquera, (peluquera) => peluquera.turnos)
  public peluquera: Peluquera;

  constructor(dia: string, hora: string) {
    this.dia = dia;
    this.hora = hora;
  }


}