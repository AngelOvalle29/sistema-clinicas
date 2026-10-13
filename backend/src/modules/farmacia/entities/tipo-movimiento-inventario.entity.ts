import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tipos_movimiento_inventario')
export class TipoMovimientoInventario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;
}
