import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class CreateEnfermedadCronicaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(20)
  codigoCie10?: string;

  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nombre: string;

  @ApiProperty()
  @IsInt()
  @Min(1)
  frecuenciaControlDias: number;
}
