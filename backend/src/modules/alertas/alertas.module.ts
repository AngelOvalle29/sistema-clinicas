import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasModule } from '../citas/citas.module';
import { EnfermedadesCronicasModule } from '../enfermedades-cronicas/enfermedades-cronicas.module';
import { HistorialModule } from '../historial/historial.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { RecetasModule } from '../recetas/recetas.module';
import { AlertasController } from './controllers/alertas.controller';
import { Alerta } from './entities/alerta.entity';
import { EstadoAlerta } from './entities/estado-alerta.entity';
import { SeveridadAlerta } from './entities/severidad-alerta.entity';
import { TipoAlerta } from './entities/tipo-alerta.entity';
import { AlertaRepository } from './repositories/alerta.repository';
import { EstadoAlertaRepository } from './repositories/estado-alerta.repository';
import { SeveridadAlertaRepository } from './repositories/severidad-alerta.repository';
import { TipoAlertaRepository } from './repositories/tipo-alerta.repository';
import { AlertasJobService } from './services/alertas-job.service';
import { AlertasService } from './services/alertas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Alerta,
      TipoAlerta,
      SeveridadAlerta,
      EstadoAlerta,
    ]),
    PacientesModule,
    EnfermedadesCronicasModule,
    HistorialModule,
    CitasModule,
    RecetasModule,
  ],
  controllers: [AlertasController],
  providers: [
    AlertaRepository,
    TipoAlertaRepository,
    SeveridadAlertaRepository,
    EstadoAlertaRepository,
    AlertasService,
    AlertasJobService,
  ],
  exports: [AlertasService],
})
export class AlertasModule {}
