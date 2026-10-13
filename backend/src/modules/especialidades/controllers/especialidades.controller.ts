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
import { CreateEspecialidadDto } from '../dto/create-especialidad.dto';
import { QueryEspecialidadDto } from '../dto/query-especialidad.dto';
import { UpdateEspecialidadDto } from '../dto/update-especialidad.dto';
import { EspecialidadesService } from '../services/especialidades.service';

@ApiTags('especialidades')
@ApiBearerAuth()
@Controller('especialidades')
export class EspecialidadesController {
  constructor(private readonly especialidadesService: EspecialidadesService) {}

  @Post()
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({ summary: 'Crear especialidad' })
  create(@Body() dto: CreateEspecialidadDto) {
    return this.especialidadesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar especialidades' })
  findAll(@Query() query: QueryEspecialidadDto) {
    return this.especialidadesService.findAll(
      query.page ?? 1,
      query.limit ?? 20,
      query.soloActivas ?? false,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener especialidad por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.findById(id);
  }

  @Patch(':id')
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({ summary: 'Actualizar especialidad' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateEspecialidadDto,
  ) {
    return this.especialidadesService.update(id, dto);
  }

  @Patch(':id/desactivar')
  @Roles(RolCodigo.ADMIN)
  @ApiOperation({
    summary: 'Desactivar especialidad (no se borra físicamente)',
  })
  desactivar(@Param('id', ParseIntPipe) id: number) {
    return this.especialidadesService.desactivar(id);
  }
}
