import { DataSource } from 'typeorm';
import { EstadoReceta } from '../../modules/recetas/entities/estado-receta.entity';
import { EstadoRecetaCodigo } from '../../modules/recetas/enums/estado-receta.enum';

const ESTADOS: Array<{
  codigo: EstadoRecetaCodigo;
  nombre: string;
  esFinal: boolean;
}> = [
  { codigo: EstadoRecetaCodigo.EMITIDA, nombre: 'Emitida', esFinal: false },
  {
    codigo: EstadoRecetaCodigo.DISPENSADA_PARCIAL,
    nombre: 'Dispensada parcial',
    esFinal: false,
  },
  {
    codigo: EstadoRecetaCodigo.DISPENSADA,
    nombre: 'Dispensada',
    esFinal: true,
  },
  { codigo: EstadoRecetaCodigo.ANULADA, nombre: 'Anulada', esFinal: true },
];

export async function seedEstadosReceta(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(EstadoReceta);
  for (const estado of ESTADOS) {
    const existente = await repo.findOne({ where: { codigo: estado.codigo } });
    if (!existente) {
      await repo.save(repo.create(estado));
    }
  }
}
