import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CitasModule } from '../citas/citas.module';
import { EnfermedadesCronicasModule } from '../enfermedades-cronicas/enfermedades-cronicas.module';
import { MedicosModule } from '../medicos/medicos.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { AlergiasController } from './controllers/alergias.controller';
import { AntecedentesController } from './controllers/antecedentes.controller';
import { ConsultasController } from './controllers/consultas.controller';
import { HistorialController } from './controllers/historial.controller';
import { SignosVitalesController } from './controllers/signos-vitales.controller';
import { Alergia } from './entities/alergia.entity';
import { Antecedente } from './entities/antecedente.entity';
import { Consulta } from './entities/consulta.entity';
import { SignoVital } from './entities/signo-vital.entity';
import { AlergiaRepository } from './repositories/alergia.repository';
import { AntecedenteRepository } from './repositories/antecedente.repository';
import { ConsultaRepository } from './repositories/consulta.repository';
import { SignoVitalRepository } from './repositories/signo-vital.repository';
import { AlergiasService } from './services/alergias.service';
import { AntecedentesService } from './services/antecedentes.service';
import { ConsultasService } from './services/consultas.service';
import { HistorialService } from './services/historial.service';
import { SignosVitalesService } from './services/signos-vitales.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consulta, SignoVital, Alergia, Antecedente]),
    PacientesModule,
    MedicosModule,
    CitasModule,
    EnfermedadesCronicasModule,
  ],
  controllers: [
    ConsultasController,
    SignosVitalesController,
    AlergiasController,
    AntecedentesController,
    HistorialController,
  ],
  providers: [
    ConsultaRepository,
    SignoVitalRepository,
    AlergiaRepository,
    AntecedenteRepository,
    ConsultasService,
    SignosVitalesService,
    AlergiasService,
    AntecedentesService,
    HistorialService,
  ],
  exports: [
    ConsultasService,
    SignosVitalesService,
    AlergiasService,
    AntecedentesService,
  ],
})
export class HistorialModule {}
