import { DataSource } from 'typeorm';
import { CategoriaPrioridad } from '../../modules/pacientes/entities/categoria-prioridad.entity';

const CATEGORIAS = [
  { codigo: 'ADULTO_MAYOR', nombre: 'Adulto mayor', nivel: 1 },
  { codigo: 'EMBARAZADA', nombre: 'Embarazada', nivel: 1 },
  { codigo: 'DISCAPACIDAD', nombre: 'Discapacidad', nivel: 1 },
  {
    codigo: 'CRONICO_DESCOMPENSADO',
    nombre: 'Paciente crónico descompensado',
    nivel: 1,
  },
  { codigo: 'PEDIATRICO', nombre: 'Paciente pediátrico', nivel: 2 },
];

export async function seedCategoriasPrioridad(
  dataSource: DataSource,
): Promise<void> {
  const repo = dataSource.getRepository(CategoriaPrioridad);
  for (const categoria of CATEGORIAS) {
    const existente = await repo.findOne({
      where: { codigo: categoria.codigo },
    });
    if (!existente) {
      await repo.save(repo.create({ ...categoria, activo: true }));
    }
  }
}
