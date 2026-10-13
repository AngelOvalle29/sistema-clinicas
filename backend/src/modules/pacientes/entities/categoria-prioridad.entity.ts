import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categorias_prioridad')
export class CategoriaPrioridad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;

  @Column()
  nivel: number;

  @Column({ default: true })
  activo: boolean;
}
