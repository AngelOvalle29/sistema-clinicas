import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from './rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombres: string;

  @Column({ length: 150 })
  apellidos: string;

  @Column({ unique: true, length: 200 })
  email: string;

  @Exclude()
  @Column({ length: 200 })
  passwordHash: string;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

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
