import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { QueryAlertaDto } from '../dto/query-alerta.dto';
import { AlertasJobService } from '../services/alertas-job.service';
import { AlertasService } from '../services/alertas.service';

@ApiTags('alertas')
@ApiBearerAuth()
@Controller('alertas')
export class AlertasController {
  constructor(
    private readonly alertasService: AlertasService,
    private readonly alertasJobService: AlertasJobService,
  ) {}

  @Get('pendientes/contador')
  @ApiOperation({
    summary: 'Contador de alertas pendientes (para el dashboard)',
  })
  async contarPendientes() {
    return { pendientes: await this.alertasService.contarPendientes() };
  }

  @Get()
  @ApiOperation({
    summary: 'Listar alertas, filtrable por severidad/estado/paciente',
  })
  findAll(@Query() query: QueryAlertaDto) {
    return this.alertasService.findAll(query.page ?? 1, query.limit ?? 20, {
      pacienteId: query.pacienteId,
      severidadCodigo: query.severidadCodigo,
      estadoCodigo: query.estadoCodigo,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener alerta por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alertasService.findById(id);
  }

  @Patch(':id/ver')
  @ApiOperation({ summary: 'Marcar una alerta como vista' })
  marcarVista(@Param('id', ParseIntPipe) id: number) {
    return this.alertasService.marcarVista(id);
  }

  @Patch(':id/atender')
  @ApiOperation({ summary: 'Marcar una alerta como atendida' })
  atender(@Param('id', ParseIntPipe) id: number) {
    return this.alertasService.atender(id);
  }

  @Patch(':id/descartar')
  @ApiOperation({ summary: 'Descartar una alerta' })
  descartar(@Param('id', ParseIntPipe) id: number) {
    return this.alertasService.descartar(id);
  }

  @Post('ejecutar-job')
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({
    summary: 'Disparar manualmente el job diario de alertas (pruebas/demo)',
  })
  async ejecutarJob() {
    await this.alertasJobService.ejecutarJobDiario();
    return { ejecutado: true };
  }
}
