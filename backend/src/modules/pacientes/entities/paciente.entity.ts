import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EstadoPaciente } from './estado-paciente.entity';

@Entity('pacientes')
export class Paciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @Column({ length: 150 })
  nombres: string;

  @Column({ length: 150 })
  apellidos: string;

  @Column({ type: 'varchar', unique: true, length: 20, nullable: true })
  dpi: string | null;

  @Column({ type: 'date', nullable: true })
  fechaNacimiento: Date | null;

  @Column({ type: 'varchar', length: 20, nullable: true })
  genero: string | null;

  @Column({ type: 'varchar', length: 30, nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  direccion: string | null;

  @ManyToOne(() => EstadoPaciente)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoPaciente;

  @Column({ default: false })
  esPrioritario: boolean;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'created_by' })
  creador: Usuario | null;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'updated_by' })
  actualizador: Usuario | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
