import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Mascota } from './mascota.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_cliente: number;

  @Column({
    name: 'dni',
    type: 'bigint',
    nullable: false,
    unique: true,
  })
  public dni: number;

  @Column({
    name: 'nombre',
    length: 50,
    nullable: false,
  })
  public nombre: string;

  @Column({
    name: 'mail',
    length: 100,
    nullable: false,
  })
  public mail: string;

  @Column({
    name: 'telefono',
    type: 'bigint',
    nullable: false,
  })
  public telefono: number;

  @OneToMany(() => Mascota, (mascota) => mascota.duenio)
  public mascotas: Mascota[];

  constructor(dni: number, nombre: string, mail: string, telefono: number) {
    this.dni = dni;
    this.nombre = nombre;
    this.mail = mail;
    this.telefono = telefono;
  }
}
