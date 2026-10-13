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
import { decimalTransformer } from '../../../common/transformers/decimal.transformer';
import { Usuario } from '../../usuarios/entities/usuario.entity';
import { Consulta } from './consulta.entity';

@Entity('signos_vitales')
export class SignoVital {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Consulta)
  @JoinColumn({ name: 'consulta_id' })
  consulta: Consulta;

  @Column({ type: 'int', nullable: true })
  presionSistolica: number | null;

  @Column({ type: 'int', nullable: true })
  presionDiastolica: number | null;

  @Column({
    type: 'decimal',
    precision: 6,
    scale: 2,
    nullable: true,
    transformer: decimalTransformer,
  })
  glucosa: number | null;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: decimalTransformer,
  })
  saturacionO2: number | null;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 1,
    nullable: true,
    transformer: decimalTransformer,
  })
  temperatura: number | null;

  @Column({
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
    transformer: decimalTransformer,
  })
  peso: number | null;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    transformer: decimalTransformer,
  })
  talla: number | null;

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
