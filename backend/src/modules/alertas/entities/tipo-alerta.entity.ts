import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipos_alerta')
export class TipoAlerta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 40 })
  codigo: string;

  @Column({ length: 150 })
  nombre: string;
}
