import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estados_receta')
export class EstadoReceta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;

  @Column({ default: false })
  esFinal: boolean;
}
