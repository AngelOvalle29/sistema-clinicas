import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('enfermedades_cronicas')
export class EnfermedadCronica {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, length: 20, nullable: true })
  codigoCie10: string | null;

  @Column({ length: 150 })
  nombre: string;

  @Column()
  frecuenciaControlDias: number;

  @Column({ default: true })
  activo: boolean;
}
