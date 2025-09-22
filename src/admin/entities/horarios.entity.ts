import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Peluquera } from './peluquera.entity';

@Entity('horarios')
export class Horario {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_horario: number;

  @Column({
    name: 'dia',
    type: 'int',
    nullable: false,
  })
  public dia: number;

  @Column({
    name: 'horario',
    nullable: false,
  })
  public horario: string;

  @ManyToOne(() => Peluquera, (peluquera) => peluquera.horarios)
  public peluquera: Peluquera;

  constructor(dia: number, horario: string) {
    this.dia = dia;
    this.horario = horario;
  }


}