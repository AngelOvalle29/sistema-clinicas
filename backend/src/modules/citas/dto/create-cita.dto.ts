import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsInt, IsOptional } from 'class-validator';

export class CreateCitaDto {
  @ApiProperty()
  @IsInt()
  pacienteId: number;

  @ApiProperty()
  @IsInt()
  medicoId: number;

  @ApiProperty()
  @IsDateString()
  fechaHoraInicio: string;

  @ApiProperty()
  @IsDateString()
  fechaHoraFin: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  esControlCronico?: boolean;
}
