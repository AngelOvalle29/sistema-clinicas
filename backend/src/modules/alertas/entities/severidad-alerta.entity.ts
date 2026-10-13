import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('severidades_alerta')
export class SeveridadAlerta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;

  @Column()
  nivel: number;
}
