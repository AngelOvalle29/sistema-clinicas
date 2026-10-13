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
import { AjustarLoteDto } from '../dto/ajustar-lote.dto';
import { CreateLoteDto } from '../dto/create-lote.dto';
import { LotesService } from '../services/lotes.service';
import { MovimientosInventarioService } from '../services/movimientos-inventario.service';

@ApiTags('farmacia')
@ApiBearerAuth()
@Controller('farmacia/lotes')
export class LotesController {
  constructor(
    private readonly lotesService: LotesService,
    private readonly movimientosInventarioService: MovimientosInventarioService,
  ) {}

  @Post()
  @Roles(RolCodigo.ADMIN, RolCodigo.FARMACIA)
  @ApiOperation({ summary: 'Registrar un lote nuevo con su entrada inicial' })
  crear(@Body() dto: CreateLoteDto) {
    return this.lotesService.crear(dto);
  }

  @Get('proximos-a-vencer')
  @ApiOperation({
    summary: 'Lotes que vencen en los próximos N días (default 30)',
  })
  findProximosAVencer(@Query('dias') dias?: string) {
    return this.lotesService.findProximosAVencer(dias ? Number(dias) : 30);
  }

  @Get('vencidos')
  @ApiOperation({ summary: 'Lotes ya vencidos' })
  findVencidos() {
    return this.lotesService.findVencidos();
  }

  @Get('producto/:productoId')
  @ApiOperation({ summary: 'Lotes de un producto ordenados por FEFO' })
  findByProducto(@Param('productoId', ParseIntPipe) productoId: number) {
    return this.lotesService.findByProductoId(productoId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener lote por id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.lotesService.findById(id);
  }

  @Get(':id/movimientos')
  @ApiOperation({
    summary: 'Historial de movimientos de inventario de un lote',
  })
  findMovimientos(@Param('id', ParseIntPipe) id: number) {
    return this.movimientosInventarioService.findByLoteId(id);
  }

  @Patch(':id/ajuste')
  @Roles(RolCodigo.ADMIN, RolCodigo.FARMACIA)
  @ApiOperation({ summary: 'Ajustar manualmente la cantidad de un lote' })
  ajustar(@Param('id', ParseIntPipe) id: number, @Body() dto: AjustarLoteDto) {
    return this.lotesService.ajustar(id, dto);
  }
}
