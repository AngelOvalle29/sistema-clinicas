import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TiposProductoService } from '../services/tipos-producto.service';

@ApiTags('farmacia')
@ApiBearerAuth()
@Controller('farmacia/tipos-producto')
export class TiposProductoController {
  constructor(private readonly tiposProductoService: TiposProductoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar tipos de producto (catálogo)' })
  findAll() {
    return this.tiposProductoService.findAll();
  }
}
