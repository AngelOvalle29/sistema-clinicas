import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { decimalTransformer } from '../../../common/transformers/decimal.transformer';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { TipoProducto } from './tipo-producto.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  principioActivo: string | null;

  @ManyToOne(() => TipoProducto)
  @JoinColumn({ name: 'tipo_producto_id' })
  tipoProducto: TipoProducto;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
    transformer: decimalTransformer,
  })
  costoUnitario: number;

  @Column({ default: 0 })
  stockMinimo: number;

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
