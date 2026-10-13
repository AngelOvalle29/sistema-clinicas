import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EstadoCita } from './estado-cita.entity';

@Entity('citas')
export class Cita {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'medico_id' })
  medico: Medico;

  @Column({ type: 'datetime' })
  fechaHoraInicio: Date;

  @Column({ type: 'datetime' })
  fechaHoraFin: Date;

  @ManyToOne(() => EstadoCita)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoCita;

  @Column({ type: 'int', nullable: true })
  nivelPrioridad: number | null;

  @Column({ default: false })
  esControlCronico: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  motivoCancelacion: string | null;

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
