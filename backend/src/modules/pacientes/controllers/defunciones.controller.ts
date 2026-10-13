import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import { QueryDefuncionDto } from '../dto/query-defuncion.dto';
import { RegistrarDefuncionDto } from '../dto/registrar-defuncion.dto';
import { DefuncionesService } from '../services/defunciones.service';

@ApiTags('pacientes')
@ApiBearerAuth()
@Controller('pacientes')
export class DefuncionesController {
  constructor(private readonly defuncionesService: DefuncionesService) {}

  @Get('fallecidos')
  @ApiOperation({
    summary: 'Listar pacientes fallecidos, filtrable por rango de fechas',
  })
  findAll(@Query() query: QueryDefuncionDto) {
    return this.defuncionesService.findAll(
      query.page ?? 1,
      query.limit ?? 20,
      query.fechaInicio,
      query.fechaFin,
    );
  }

  @Post(':id/defuncion')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Registrar la defunción de un paciente' })
  registrar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegistrarDefuncionDto,
  ) {
    return this.defuncionesService.registrar(id, dto);
  }
}
