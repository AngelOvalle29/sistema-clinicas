import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipos_producto')
export class TipoProducto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;
}
