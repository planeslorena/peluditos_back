import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('razas')
export class Raza {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_raza: number;

  @Column({
    name: 'raza',
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  public raza: string;

  constructor(raza: string) {
    this.raza = raza;
  }
}


