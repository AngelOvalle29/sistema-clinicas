import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EnfermedadCronica } from './enfermedad-cronica.entity';

@Entity('paciente_enfermedades_cronicas')
export class PacienteEnfermedadCronica {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => EnfermedadCronica)
  @JoinColumn({ name: 'enfermedad_cronica_id' })
  enfermedadCronica: EnfermedadCronica;

  @Column({ type: 'int', nullable: true })
  frecuenciaControlDiasOverride: number | null;

  @Column({ default: true })
  activo: boolean;

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
