import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNumber, IsOptional } from 'class-validator';

export class RegistrarSignosVitalesDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  presionSistolica?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsInt()
  presionDiastolica?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  glucosa?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  saturacionO2?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperatura?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  peso?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  talla?: number;
}
