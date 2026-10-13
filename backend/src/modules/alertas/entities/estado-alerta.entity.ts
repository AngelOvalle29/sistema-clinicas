import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estados_alerta')
export class EstadoAlerta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;
}
