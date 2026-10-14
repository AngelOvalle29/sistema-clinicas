import {
  Body,
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
import { CancelarCitaDto } from '../dto/cancelar-cita.dto';
import { CreateCitaDto } from '../dto/create-cita.dto';
import { QueryCitaDto } from '../dto/query-cita.dto';
import { CitasService } from '../services/citas.service';

@ApiTags('citas')
@ApiBearerAuth()
@Controller('citas')
export class CitasController {
  constructor(private readonly citasService: CitasService) {}

  @Post()
  @Roles(RolCodigo.ADMIN, RolCodigo.RECEPCION)
  @ApiOperation({ summary: 'Programar una cita' })
  create(@Body() dto: CreateCitaDto) {
    return this.citasService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar citas (agenda ordenada por prioridad y hora)',
  })
  findAll(@Query() query: QueryCitaDto) {
    return this.citasService.findAll(query.page ?? 1, query.limit ?? 20, {
      pacienteId: query.pacienteId,
      medicoId: query.medicoId,
      fecha: query.fecha
        ? new Date(`${query.fecha.slice(0, 10)}T00:00:00`)
        : undefined,
      estadoCodigo: query.estadoCodigo,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener cita por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.findById(id);
  }

  @Patch(':id/confirmar')
  @Roles(RolCodigo.ADMIN, RolCodigo.RECEPCION, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Confirmar una cita programada' })
  confirmar(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.confirmar(id);
  }

  @Patch(':id/iniciar')
  @Roles(RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Iniciar la consulta (pasar a EN_CURSO)' })
  iniciar(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.iniciar(id);
  }

  @Patch(':id/completar')
  @Roles(RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Completar la cita' })
  completar(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.completar(id);
  }

  @Patch(':id/cancelar')
  @Roles(RolCodigo.ADMIN, RolCodigo.RECEPCION, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Cancelar una cita' })
  cancelar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CancelarCitaDto,
  ) {
    return this.citasService.cancelar(id, dto);
  }

  @Patch(':id/no-asistio')
  @Roles(RolCodigo.ADMIN, RolCodigo.RECEPCION, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Marcar que el paciente no asistió' })
  marcarNoAsistio(@Param('id', ParseIntPipe) id: number) {
    return this.citasService.marcarNoAsistio(id);
  }
}
