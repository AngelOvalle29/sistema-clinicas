import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FarmaciaModule } from '../farmacia/farmacia.module';
import { HistorialModule } from '../historial/historial.module';
import { MedicosModule } from '../medicos/medicos.module';
import { PacientesModule } from '../pacientes/pacientes.module';
import { RecetasController } from './controllers/recetas.controller';
import { EstadoReceta } from './entities/estado-receta.entity';
import { RecetaDetalle } from './entities/receta-detalle.entity';
import { Receta } from './entities/receta.entity';
import { EstadoRecetaRepository } from './repositories/estado-receta.repository';
import { RecetaDetalleRepository } from './repositories/receta-detalle.repository';
import { RecetaRepository } from './repositories/receta.repository';
import { RecetasService } from './services/recetas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Receta, RecetaDetalle, EstadoReceta]),
    PacientesModule,
    MedicosModule,
    FarmaciaModule,
    HistorialModule,
  ],
  controllers: [RecetasController],
  providers: [
    RecetaRepository,
    RecetaDetalleRepository,
    EstadoRecetaRepository,
    RecetasService,
  ],
  exports: [RecetasService],
})
export class RecetasModule {}
