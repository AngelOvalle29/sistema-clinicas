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
import { CategoriaPrioridad } from './categoria-prioridad.entity';
import { Paciente } from './paciente.entity';

@Entity('paciente_prioridades')
export class PacientePrioridad {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => CategoriaPrioridad)
  @JoinColumn({ name: 'categoria_prioridad_id' })
  categoriaPrioridad: CategoriaPrioridad;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'date' })
  fechaAsignacion: Date;

  @Column({ type: 'date', nullable: true })
  fechaRetiro: Date | null;

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
