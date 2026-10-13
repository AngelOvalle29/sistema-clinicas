import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsInt,
  ValidateNested,
} from 'class-validator';
import { DetalleRecetaDto } from './detalle-receta.dto';

export class CreateRecetaDto {
  @ApiProperty()
  @IsInt()
  pacienteId: number;

  @ApiProperty()
  @IsDateString()
  vigenteHasta: string;

  @ApiProperty({ type: [DetalleRecetaDto] })
  @ValidateNested({ each: true })
  @Type(() => DetalleRecetaDto)
  @ArrayMinSize(1)
  detalles: DetalleRecetaDto[];
}
