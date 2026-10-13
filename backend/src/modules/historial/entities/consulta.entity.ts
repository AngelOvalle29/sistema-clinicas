import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cita } from '../../citas/entities/cita.entity';
import { Medico } from '../../medicos/entities/medico.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';

@Entity('consultas')
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cita, { nullable: true })
  @JoinColumn({ name: 'cita_id' })
  cita: Cita | null;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'medico_id' })
  medico: Medico;

  @Column({ type: 'datetime' })
  fecha: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivo: string | null;

  @Column({ type: 'varchar', length: 500, nullable: true })
  diagnostico: string | null;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

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
