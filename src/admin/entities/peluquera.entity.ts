import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mascota } from 'src/client/entities/mascota.entity';
import { Turno } from 'src/turnos/entities/turno.entity';

@Entity('peluqueras')
export class Peluquera {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_turno: number;

  @Column({
    name: 'nombre',
    length: 50,
    nullable: false,
  })
  public nombre: string;

  @Column({
    name: 'dni',
    type: 'int',
    nullable: false,
  })
  public dni: number;

  @OneToMany(() => Turno, (turno) => turno.peluquera)
  public turnos: Turno[];


  constructor(nombre: string, dni: number) {
    this.nombre = nombre;
    this.dni = dni;
  }


}