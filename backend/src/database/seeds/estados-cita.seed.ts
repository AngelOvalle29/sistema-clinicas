import { DataSource } from 'typeorm';
import { EstadoCita } from '../../modules/citas/entities/estado-cita.entity';
import { EstadoCitaCodigo } from '../../modules/citas/enums/estado-cita.enum';

const ESTADOS: Array<{
  codigo: EstadoCitaCodigo;
  nombre: string;
  esFinal: boolean;
}> = [
  { codigo: EstadoCitaCodigo.PROGRAMADA, nombre: 'Programada', esFinal: false },
  { codigo: EstadoCitaCodigo.CONFIRMADA, nombre: 'Confirmada', esFinal: false },
  { codigo: EstadoCitaCodigo.EN_CURSO, nombre: 'En curso', esFinal: false },
  { codigo: EstadoCitaCodigo.COMPLETADA, nombre: 'Completada', esFinal: true },
  { codigo: EstadoCitaCodigo.CANCELADA, nombre: 'Cancelada', esFinal: true },
  { codigo: EstadoCitaCodigo.NO_ASISTIO, nombre: 'No asistió', esFinal: true },
];

export async function seedEstadosCita(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(EstadoCita);
  for (const estado of ESTADOS) {
    const existente = await repo.findOne({ where: { codigo: estado.codigo } });
    if (!existente) {
      await repo.save(repo.create(estado));
    }
  }
}
