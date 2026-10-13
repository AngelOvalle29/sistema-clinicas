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
import { Lote } from './lote.entity';
import { TipoMovimientoInventario } from './tipo-movimiento-inventario.entity';

@Entity('movimientos_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Lote)
  @JoinColumn({ name: 'lote_id' })
  lote: Lote;

  @ManyToOne(() => TipoMovimientoInventario)
  @JoinColumn({ name: 'tipo_movimiento_id' })
  tipoMovimiento: TipoMovimientoInventario;

  @Column()
  cantidad: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  referenciaTipo: string | null;

  @Column({ type: 'int', nullable: true })
  referenciaId: number | null;

  @Column({ type: 'datetime' })
  fecha: Date;

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
