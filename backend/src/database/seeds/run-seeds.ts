import 'dotenv/config';
import dataSource from '../data-source';
import { seedAdmin } from './admin.seed';
import { seedCategoriasPrioridad } from './categorias-prioridad.seed';
import { seedEstadosAlerta } from './estados-alerta.seed';
import { seedEstadosCita } from './estados-cita.seed';
import { seedEstadosPaciente } from './estados-paciente.seed';
import { seedEstadosReceta } from './estados-receta.seed';
import { seedRoles } from './roles.seed';
import { seedSeveridadesAlerta } from './severidades-alerta.seed';
import { seedTiposAlerta } from './tipos-alerta.seed';
import { seedTiposMovimientoInventario } from './tipos-movimiento-inventario.seed';
import { seedTiposProducto } from './tipos-producto.seed';

async function runSeeds() {
  await dataSource.initialize();

  await seedRoles(dataSource);
  await seedAdmin(dataSource);
  await seedEstadosPaciente(dataSource);
  await seedCategoriasPrioridad(dataSource);
  await seedEstadosCita(dataSource);
  await seedTiposProducto(dataSource);
  await seedTiposMovimientoInventario(dataSource);
  await seedEstadosReceta(dataSource);
  await seedTiposAlerta(dataSource);
  await seedSeveridadesAlerta(dataSource);
  await seedEstadosAlerta(dataSource);

  await dataSource.destroy();
  console.log('Seeds ejecutados correctamente.');
}

runSeeds().catch((error) => {
  console.error('Error ejecutando seeds:', error);
  process.exit(1);
});
