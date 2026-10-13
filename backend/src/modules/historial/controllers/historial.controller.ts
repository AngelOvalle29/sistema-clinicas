import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HistorialService } from '../services/historial.service';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class HistorialController {
  constructor(private readonly historialService: HistorialService) {}

  @Get(':id/historial')
  @ApiOperation({ summary: 'Historial médico completo del paciente' })
  obtenerHistorial(@Param('id', ParseIntPipe) id: number) {
    return this.historialService.obtenerHistorialCompleto(id);
  }
}
