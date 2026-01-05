import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Peluquera } from 'src/admin/entities/peluquera.entity';

@Index(['dia', 'hora', 'peluquera'], { unique: true })
@Entity('turnosdeshabilitados')
export class TurnoDeshabilitado {
  @PrimaryGeneratedColumn({
    type: 'int',
  })
  public id_turno_deshabilitado: number;

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

  @ManyToOne(() => Peluquera, (peluquera) => peluquera.turnosDeshabilitados)
  public peluquera: Peluquera;

  constructor(dia: string, hora: string) {
    this.dia = dia;
    this.hora = hora;
  }


}