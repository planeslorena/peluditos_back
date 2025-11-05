import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Turno } from 'src/turnos/entities/turno.entity';
import { Horario } from './horarios.entity';

@Entity('peluqueras')
export class Peluquera {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_peluquera: number;

  @Column({
    name: 'nombre',
    length: 50,
    nullable: false,
  })
  public nombre: string;

  @Column({
    name: 'dni',
    type: 'int',
    unique: true,
    nullable: false,
  })
  public dni: number;

    @Column({
    name: 'telefono',
    type: 'bigint',
    nullable: false,
  })
  public telefono: number;

      @Column({
    name: 'fecha_nacimiento',
    type: 'date',
    nullable: false,
  })
  public fecha_nacimiento: Date;

  @OneToMany(() => Turno, (turno) => turno.peluquera)
  public turnos: Turno[];

  @OneToMany(() => Horario, (horario) => horario.peluquera)
  public horarios: Horario[];

  constructor(nombre: string, dni: number, telefono: number, fecha_nacimiento: Date) {
    this.nombre = nombre;
    this.dni = dni;
    this.telefono = telefono;
    this.fecha_nacimiento = fecha_nacimiento;
  }


}