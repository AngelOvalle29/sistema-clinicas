import { DataSource } from 'typeorm';
import { RolCodigo } from '../../common/enums/rol-codigo.enum';
import { Rol } from '../../modules/usuarios/entities/rol.entity';

const ROLES: Array<{ codigo: RolCodigo; nombre: string }> = [
  { codigo: RolCodigo.ADMIN, nombre: 'Administrador' },
  { codigo: RolCodigo.MEDICO, nombre: 'Médico' },
  { codigo: RolCodigo.RECEPCION, nombre: 'Recepción' },
  { codigo: RolCodigo.FARMACIA, nombre: 'Farmacia' },
];

export async function seedRoles(dataSource: DataSource): Promise<void> {
  const repo = dataSource.getRepository(Rol);
  for (const rol of ROLES) {
    const existente = await repo.findOne({ where: { codigo: rol.codigo } });
    if (!existente) {
      await repo.save(repo.create(rol));
    }
  }
}
