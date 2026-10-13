import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Medico } from '../../medicos/entities/medico.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Paciente } from './paciente.entity';

@Entity('defunciones')
export class Defuncion {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Paciente)
  @JoinColumn({ name: 'paciente_id' })
  paciente: Paciente;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({ length: 255 })
  causa: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  numeroCertificado: string | null;

  @ManyToOne(() => Medico)
  @JoinColumn({ name: 'medico_certifica_id' })
  medicoCertifica: Medico;

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
