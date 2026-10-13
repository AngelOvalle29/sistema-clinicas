import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('roles')
export class Rol {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ default: true })
  activo: boolean;
}
