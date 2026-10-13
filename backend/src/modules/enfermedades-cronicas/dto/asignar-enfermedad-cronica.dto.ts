import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min } from 'class-validator';

export class AsignarEnfermedadCronicaDto {
  @ApiProperty()
  @IsInt()
  enfermedadCronicaId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(1)
  frecuenciaControlDiasOverride?: number;
}
