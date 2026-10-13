import { DataSource } from 'typeorm';
import { SeveridadAlerta } from '../../modules/alertas/entities/severidad-alerta.entity';
import { SeveridadAlertaCodigo } from '../../modules/alertas/enums/severidad-alerta.enum';

const SEVERIDADES: Array<{
  codigo: SeveridadAlertaCodigo;
  nombre: string;
  nivel: number;
}> = [
  { codigo: SeveridadAlertaCodigo.BAJA, nombre: 'Baja', nivel: 1 },
  { codigo: SeveridadAlertaCodigo.MEDIA, nombre: 'Media', nivel: 2 },
  { codigo: SeveridadAlertaCodigo.ALTA, nombre: 'Alta', nivel: 3 },
  { codigo: SeveridadAlertaCodigo.CRITICA, nombre: 'Crítica', nivel: 4 },
];

export async function seedSeveridadesAlerta(
  dataSource: DataSource,
): Promise<void> {
  const repo = dataSource.getRepository(SeveridadAlerta);
  for (const severidad of SEVERIDADES) {
    const existente = await repo.findOne({
      where: { codigo: severidad.codigo },
    });
    if (!existente) {
      await repo.save(repo.create(severidad));
    }
  }
}
