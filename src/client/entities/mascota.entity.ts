import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Cliente } from './client.entity';
import { Turno } from 'src/turnos/entities/turno.entity';

@Entity('mascotas')
export class Mascota {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_mascota: number;

  @Column({
    name: 'nombre',
    length: 50,
    nullable: false,
  })
  public nombre: string;

  @Column({
    name: 'edad',
    type: 'int',
    nullable: false,
  })
  public edad: number;

  @Column({
    name: 'raza',
    type: 'varchar',
    length: 30,
    nullable: false,
  })
  public raza: string;

  @Column({
    name: 'castrado',
    type: 'boolean',
    nullable: false,
  })
  public castrado: boolean;

  @Column({
    name: 'veterinario',
    type: 'varchar',
    length: 30,
  })
  public veterinario: string;

  @Column({
    name: 'tel_veterinario',
    type: 'int',
  })
  public tel_veterinario: number;

  @Column({
    name: 'desparacitario',
    type: 'datetime',
  })
  public desparacitario: Date;

  @Column({
    name: 'pipeta',
    type: 'datetime',
  })
  public pipeta: Date;

  @Column({
    name: 'sectuple',
    type: 'datetime',
  })
  public sectuple: Date;

  @Column({
    name: 'antirabica',
    type: 'datetime',
  })
  public antirabica: Date;

  @Column({
    name: 'shampoo',
    type: 'varchar',
    length: 50,
  })
  public shampoo: string;

  @Column({
    name: 'observaciones',

    type: 'varchar',
    length: 200,
  })
  public observaciones: string;

  @ManyToOne(() => Cliente, (cliente) => cliente.mascotas)
  public duenio: Cliente;

  @OneToMany(() => Turno, (turno) => turno.mascota)
  public turnos: Turno[];

  constructor(nombre: string, edad: number, raza: string, castrado: boolean) {
    this.nombre = nombre;
    this.edad = edad;
    this.raza = raza;
    this.castrado = castrado;
  }


}