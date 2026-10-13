import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class RegistrarDefuncionDto {
  @ApiProperty()
  @IsDateString()
  fecha: string;

  @ApiProperty()
  @IsString()
  @MaxLength(255)
  causa: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  numeroCertificado?: string;

  @ApiProperty()
  @IsInt()
  medicoCertificaId: number;
}
