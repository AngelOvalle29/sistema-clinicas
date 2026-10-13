import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MaxLength,
} from 'class-validator';

export class CreateProductoDto {
  @ApiProperty()
  @IsString()
  @MaxLength(30)
  codigo: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  principioActivo?: string;

  @ApiProperty()
  @IsInt()
  tipoProductoId: number;

  @ApiPropertyOptional({
    description: 'Se ignora y queda en 0 si el tipo es MUESTRA_MEDICA',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costoUnitario?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  @Min(0)
  stockMinimo?: number;
}
