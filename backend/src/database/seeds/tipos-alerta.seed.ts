import { DataSource } from 'typeorm';
import { TipoAlerta } from '../../modules/alertas/entities/tipo-alerta.entity';
import { TipoAlertaCodigo } from '../../modules/alertas/enums/tipo-alerta.enum';

const TIPOS: Array<{ codigo: TipoAlertaCodigo; nombre: string }> = [
  { codigo: TipoAlertaCodigo.CONTROL_VENCIDO, nombre: 'Control vencido' },
  {
    codigo: TipoAlertaCodigo.SIN_CITA_PROGRAMADA,
    nombre: 'Sin cita programada',
  },
  {
    codigo: TipoAlertaCodigo.VALOR_FUERA_RANGO,
    nombre: 'Valor fuera de rango',
  },
  {
    codigo: TipoAlertaCodigo.MEDICACION_POR_TERMINAR,
    nombre: 'Medicación por terminar',
  },
];

export async function seedTiposAlerta(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(TipoAlerta);
  for (const tipo of TIPOS) {
    const existente = await repo.findOne({ where: { codigo: tipo.codigo } });
    if (!existente) {
      await repo.save(repo.create(tipo));
    }
  }
}
