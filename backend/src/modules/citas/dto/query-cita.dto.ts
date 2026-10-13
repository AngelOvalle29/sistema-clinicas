import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryCitaDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pacienteId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  medicoId?: number;

  @IsOptional()
  @IsDateString()
  fecha?: string;

  @IsOptional()
  @IsString()
  estadoCodigo?: string;
}
