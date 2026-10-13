import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';
import type { AuthenticatedUser } from '../../../common/interfaces/authenticated-user.interface';
import { RegistrarSignosVitalesDto } from '../dto/registrar-signos-vitales.dto';
import { SignosVitalesService } from '../services/signos-vitales.service';

@ApiTags('historial')
@ApiBearerAuth()
@Controller('historial/consultas')
export class SignosVitalesController {
  constructor(private readonly signosVitalesService: SignosVitalesService) {}

  @Post(':id/signos-vitales')
  @Roles(RolCodigo.MEDICO)
  @ApiOperation({ summary: 'Registrar signos vitales de una consulta' })
  registrar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: RegistrarSignosVitalesDto,
    @CurrentUser() usuario: AuthenticatedUser,
  ) {
    return this.signosVitalesService.registrar(id, dto, usuario.id);
  }

  @Get(':id/signos-vitales')
  @ApiOperation({ summary: 'Obtener signos vitales de una consulta' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.signosVitalesService.findByConsultaId(id);
  }
}
