import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('especialidades')
export class Especialidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 150 })
  nombre: string;

  @Column({ default: true })
  activo: boolean;
}
