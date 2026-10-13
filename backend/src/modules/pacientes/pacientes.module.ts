import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicosModule } from '../medicos/medicos.module';
import { CategoriasPrioridadController } from './controllers/categorias-prioridad.controller';
import { DefuncionesController } from './controllers/defunciones.controller';
import { PacientesController } from './controllers/pacientes.controller';
import { PrioridadesController } from './controllers/prioridades.controller';
import { CategoriaPrioridad } from './entities/categoria-prioridad.entity';
import { Defuncion } from './entities/defuncion.entity';
import { EstadoPaciente } from './entities/estado-paciente.entity';
import { PacientePrioridad } from './entities/paciente-prioridad.entity';
import { Paciente } from './entities/paciente.entity';
import { CategoriaPrioridadRepository } from './repositories/categoria-prioridad.repository';
import { DefuncionRepository } from './repositories/defuncion.repository';
import { EstadoPacienteRepository } from './repositories/estado-paciente.repository';
import { PacientePrioridadRepository } from './repositories/paciente-prioridad.repository';
import { PacienteRepository } from './repositories/paciente.repository';
import { CategoriasPrioridadService } from './services/categorias-prioridad.service';
import { DefuncionesService } from './services/defunciones.service';
import { PacientesService } from './services/pacientes.service';
import { PrioridadesService } from './services/prioridades.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Paciente,
      EstadoPaciente,
      CategoriaPrioridad,
      PacientePrioridad,
      Defuncion,
    ]),
    MedicosModule,
  ],
  // Orden importa: DefuncionesController registra la ruta literal
  // 'pacientes/fallecidos' antes que PacientesController registre 'pacientes/:id',
  // si no, Nest/Express matchea ':id' primero y 'fallecidos' nunca se alcanza.
  controllers: [
    DefuncionesController,
    PrioridadesController,
    PacientesController,
    CategoriasPrioridadController,
  ],
  providers: [
    PacienteRepository,
    EstadoPacienteRepository,
    CategoriaPrioridadRepository,
    PacientePrioridadRepository,
    DefuncionRepository,
    PacientesService,
    PrioridadesService,
    DefuncionesService,
    CategoriasPrioridadService,
  ],
  exports: [PacientesService, PrioridadesService],
})
export class PacientesModule {}
