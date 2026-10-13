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
import { EstadoAlerta } from './estado-alerta.entity';
import { SeveridadAlerta } from './severidad-alerta.entity';
import { TipoAlerta } from './tipo-alerta.entity';

@Entity('alertas')
export class Alerta {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @ManyToOne(() => TipoAlerta)
  @JoinColumn({ name: 'tipo_alerta_id' })
  tipoAlerta: TipoAlerta;

  @ManyToOne(() => SeveridadAlerta)
  @JoinColumn({ name: 'severidad_id' })
  severidad: SeveridadAlerta;

  @ManyToOne(() => EstadoAlerta)
  @JoinColumn({ name: 'estado_id' })
  estado: EstadoAlerta;

  @Column({ length: 500 })
  mensaje: string;

  @Column({ type: 'datetime' })
  fechaGenerada: Date;

  @Column({ type: 'datetime', nullable: true })
  fechaAtendida: Date | null;

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
