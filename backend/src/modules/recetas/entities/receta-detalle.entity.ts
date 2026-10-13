import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Producto } from '../../farmacia/entities/producto.entity';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Receta } from './receta.entity';

@Entity('receta_detalles')
export class RecetaDetalle {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Receta)
  @JoinColumn({ name: 'receta_id' })
  receta: Receta;

  @ManyToOne(() => Producto)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;

  @Column()
  cantidadPrescrita: number;

  @Column({ default: 0 })
  cantidadDispensada: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  indicaciones: string | null;

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
