import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CategoriasPrioridadService } from '../services/categorias-prioridad.service';

@ApiTags('categorias-prioridad')
@ApiBearerAuth()
@Controller('categorias-prioridad')
export class CategoriasPrioridadController {
  constructor(
    private readonly categoriasPrioridadService: CategoriasPrioridadService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listar categorías de prioridad activas (catálogo)',
  })
  findActivas() {
    return this.categoriasPrioridadService.findActivas();
  }
}
