import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class DetalleRecetaDto {
  @ApiProperty()
  @IsInt()
  productoId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  cantidadPrescrita: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(255)
  indicaciones?: string;
}
