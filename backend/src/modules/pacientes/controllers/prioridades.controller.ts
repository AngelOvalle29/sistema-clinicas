import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { AsignarPrioridadDto } from '../dto/asignar-prioridad.dto';
import { PrioridadesService } from '../services/prioridades.service';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class PrioridadesController {
  constructor(private readonly prioridadesService: PrioridadesService) {}

  @Post(':id/prioridades')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO, RolCodigo.RECEPCION)
  @ApiOperation({ summary: 'Asignar una categoría de prioridad a un paciente' })
  asignar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AsignarPrioridadDto,
  ) {
    return this.prioridadesService.asignar(id, dto);
  }

  @Get(':id/prioridades')
  @ApiOperation({ summary: 'Listar prioridades activas de un paciente' })
  findActivas(@Param('id', ParseIntPipe) id: number) {
    return this.prioridadesService.findActivasByPaciente(id);
  }

  @Patch('prioridades/:prioridadId/retirar')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO, RolCodigo.RECEPCION)
  @ApiOperation({ summary: 'Retirar una prioridad asignada' })
  retirar(@Param('prioridadId', ParseIntPipe) prioridadId: number) {
    return this.prioridadesService.retirar(prioridadId);
  }
}
