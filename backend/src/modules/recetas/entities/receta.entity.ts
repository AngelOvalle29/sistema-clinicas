import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';
import { Paciente } from '../../pacientes/entities/paciente.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { EstadoReceta } from './estado-receta.entity';
import { RecetaDetalle } from './receta-detalle.entity';

@Entity('recetas')
export class Receta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 20 })
  codigo: string;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'medico_id' })
  medico: Medico;

  @ManyToOne(() => EstadoReceta)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoReceta;

  @Column({ type: 'datetime' })
  fechaEmision: Date;

  @Column({ type: 'date' })
  vigenteHasta: Date;

  @OneToMany(() => RecetaDetalle, (detalle) => detalle.receta)
  detalles: RecetaDetalle[];

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
