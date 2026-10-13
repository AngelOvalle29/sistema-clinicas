import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('estados_paciente')
export class EstadoPaciente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 30 })
  codigo: string;

  @Column({ length: 100 })
  nombre: string;
}
