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
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { CreateRecetaDto } from '../dto/create-receta.dto';
import { QueryRecetaDto } from '../dto/query-receta.dto';
import { RecetasService } from '../services/recetas.service';

@ApiTags('recetas')
@ApiBearerAuth()
@Controller('recetas')
export class RecetasController {
  constructor(private readonly recetasService: RecetasService) {}

  @Post()
  @Roles(RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Emitir una receta (solo MEDICO)' })
  create(
    @Body() dto: CreateRecetaDto,
    @CurrentUser() usuario: AuthenticatedUser,
  ) {
    return this.recetasService.create(dto, usuario.id);
  }

  @Get()
  @ApiOperation({ summary: 'Listar recetas' })
  findAll(@Query() query: QueryRecetaDto) {
    return this.recetasService.findAll(query.page ?? 1, query.limit ?? 20, {
      pacienteId: query.pacienteId,
      medicoId: query.medicoId,
      estadoCodigo: query.estadoCodigo,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener receta por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.findById(id);
  }

  @Post(':id/dispensar')
  @Roles(RolCodigo.FARMACIA)
  @ApiOperation({
    summary: 'Dispensar una receta por FEFO (puede quedar parcial)',
  })
  dispensar(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.dispensar(id);
  }

  @Patch(':id/anular')
  @Roles(RolCodigo.ADMIN, RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Anular una receta no dispensada' })
  anular(@Param('id', ParseIntPipe) id: number) {
    return this.recetasService.anular(id);
  }
}
