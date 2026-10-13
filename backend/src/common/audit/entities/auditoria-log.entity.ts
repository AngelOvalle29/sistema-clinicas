import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Usuario } from '../../../modules/usuarios/entities/usuario.entity';
import { AccionAuditoria } from '../../enums/accion-auditoria.enum';

@Entity('auditoria_logs')
export class AuditoriaLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Usuario, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario | null;

  @Column({ type: 'enum', enum: AccionAuditoria })
  accion: AccionAuditoria;

  @Column({ length: 100 })
  tablaAfectada: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  registroId: string | null;

  @Column({ type: 'json', nullable: true })
  datosAnteriores: Record<string, unknown> | null;

  @Column({ type: 'json', nullable: true })
  datosNuevos: Record<string, unknown> | null;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip: string | null;

  @CreateDateColumn({ name: 'creado_en' })
  creadoEn: Date;
}
