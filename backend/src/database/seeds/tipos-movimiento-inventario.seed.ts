import { DataSource } from 'typeorm';
import { TipoMovimientoInventario } from '../../modules/farmacia/entities/tipo-movimiento-inventario.entity';
import { TipoMovimientoInventarioCodigo } from '../../modules/farmacia/enums/tipo-movimiento-inventario.enum';

const TIPOS: Array<{ codigo: TipoMovimientoInventarioCodigo; nombre: string }> =
  [
    { codigo: TipoMovimientoInventarioCodigo.ENTRADA, nombre: 'Entrada' },
    { codigo: TipoMovimientoInventarioCodigo.SALIDA, nombre: 'Salida' },
    { codigo: TipoMovimientoInventarioCodigo.AJUSTE, nombre: 'Ajuste' },
    {
      codigo: TipoMovimientoInventarioCodigo.VENCIMIENTO,
      nombre: 'Vencimiento',
    },
  ];

export async function seedTiposMovimientoInventario(
  dataSource: DataSource,
): Promise<void> {
  const repo = dataSource.getRepository(TipoMovimientoInventario);
  for (const tipo of TIPOS) {
    const existente = await repo.findOne({ where: { codigo: tipo.codigo } });
    if (!existente) {
      await repo.save(repo.create(tipo));
    }
  }
}
