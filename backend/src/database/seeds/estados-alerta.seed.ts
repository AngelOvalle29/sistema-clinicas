import { DataSource } from 'typeorm';
import { EstadoAlerta } from '../../modules/alertas/entities/estado-alerta.entity';
import { EstadoAlertaCodigo } from '../../modules/alertas/enums/estado-alerta.enum';

const ESTADOS: Array<{ codigo: EstadoAlertaCodigo; nombre: string }> = [
  { codigo: EstadoAlertaCodigo.PENDIENTE, nombre: 'Pendiente' },
  { codigo: EstadoAlertaCodigo.VISTA, nombre: 'Vista' },
  { codigo: EstadoAlertaCodigo.ATENDIDA, nombre: 'Atendida' },
  { codigo: EstadoAlertaCodigo.DESCARTADA, nombre: 'Descartada' },
];

export async function seedEstadosAlerta(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(EstadoAlerta);
  for (const estado of ESTADOS) {
    const existente = await repo.findOne({ where: { codigo: estado.codigo } });
    if (!existente) {
      await repo.save(repo.create(estado));
    }
  }
}
