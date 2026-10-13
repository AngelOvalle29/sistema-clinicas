import * as bcrypt from 'bcrypt';
import { DataSource } from 'typeorm';
import { RolCodigo } from '../../common/enums/rol-codigo.enum';
import { Rol } from '../../modules/usuarios/entities/rol.entity';
import { Usuario } from '../../modules/usuarios/entities/usuario.entity';

const SALT_ROUNDS = 10;

export async function seedAdmin(dataSource: DataSource): Promise<void> {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    console.warn(
      'ADMIN_EMAIL/ADMIN_PASSWORD no están definidos; se omite el seed de admin.',
    );
    return;
  }

  const usuarioRepo = dataSource.getRepository(Usuario);
  const existente = await usuarioRepo.findOne({ where: { email } });
  if (existente) {
    return;
  }

  const rolRepo = dataSource.getRepository(Rol);
  const rolAdmin = await rolRepo.findOne({
    where: { codigo: RolCodigo.ADMIN },
  });
  if (!rolAdmin) {
    throw new Error('El rol ADMIN no está seedeado; corre seedRoles primero.');
  }

  const admin = usuarioRepo.create({
    nombres: 'Administrador',
    apellidos: 'Sistema',
    email,
    passwordHash: await bcrypt.hash(password, SALT_ROUNDS),
    rol: rolAdmin,
    activo: true,
  });
  await usuarioRepo.save(admin);
}
