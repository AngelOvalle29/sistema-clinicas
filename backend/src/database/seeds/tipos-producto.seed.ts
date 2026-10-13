import { DataSource } from 'typeorm';
import { TipoProducto } from '../../modules/farmacia/entities/tipo-producto.entity';
import { TipoProductoCodigo } from '../../modules/farmacia/enums/tipo-producto.enum';

const TIPOS: Array<{ codigo: TipoProductoCodigo; nombre: string }> = [
  { codigo: TipoProductoCodigo.MEDICAMENTO, nombre: 'Medicamento' },
  { codigo: TipoProductoCodigo.MUESTRA_MEDICA, nombre: 'Muestra médica' },
  { codigo: TipoProductoCodigo.INSUMO, nombre: 'Insumo' },
];

export async function seedTiposProducto(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(TipoProducto);
  for (const tipo of TIPOS) {
    const existente = await repo.findOne({ where: { codigo: tipo.codigo } });
    if (!existente) {
      await repo.save(repo.create(tipo));
    }
  }
}
