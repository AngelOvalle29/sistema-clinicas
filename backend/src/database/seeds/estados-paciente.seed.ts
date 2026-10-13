import { DataSource } from 'typeorm';
import { EstadoPaciente } from '../../modules/pacientes/entities/estado-paciente.entity';
import { EstadoPacienteCodigo } from '../../modules/pacientes/enums/estado-paciente.enum';

const ESTADOS: Array<{ codigo: EstadoPacienteCodigo; nombre: string }> = [
  { codigo: EstadoPacienteCodigo.ACTIVO, nombre: 'Activo' },
  { codigo: EstadoPacienteCodigo.INACTIVO, nombre: 'Inactivo' },
  { codigo: EstadoPacienteCodigo.FALLECIDO, nombre: 'Fallecido' },
];

export async function seedEstadosPaciente(
  dataSource: DataSource,
): Promise<void> {
  const repo = dataSource.getRepository(EstadoPaciente);
  for (const estado of ESTADOS) {
    const existente = await repo.findOne({ where: { codigo: estado.codigo } });
    if (!existente) {
      await repo.save(repo.create(estado));
    }
  }
}
