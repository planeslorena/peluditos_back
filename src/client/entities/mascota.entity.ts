import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
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
    name: 'desparasitado',
    type: 'boolean',
    nullable: false,
  })
  public desparasitado: boolean;

  @Column({
    name: 'veterinario',
    type: 'varchar',
    length: 30,
    nullable: true
  })
  public veterinario: string;

  @Column({
    name: 'tel_veterinario',
    type: 'bigint',
    nullable: true
  })
  public tel_veterinario: number;

  @Column({
    name: 'direccion_veterinario',
    type: 'varchar',
    length: 100,
    nullable: true
  })
  public direccion_veterinario: string;

  @Column({
    name: 'sextuple',
    type: 'varchar',
    length: 7,
    nullable: true
  })
  public sextuple: string;

  @Column({
    name: 'antirrabica',
    type: 'varchar',
    length: 7,
    nullable: true
  })
  public antirrabica: string;

  @Column({
    name: 'shampoo',
    type: 'varchar',
    length: 50,
    nullable: true
  })
  public shampoo: string;

  @Column({
    name: 'observaciones',
    type: 'varchar',
    length: 200,
    nullable: true
  })
  public observaciones: string;

  @DeleteDateColumn(
    { nullable: true })
  public deleted_at?: Date;


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