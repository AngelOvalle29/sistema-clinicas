import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryAlertaDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pacienteId?: number;

  @IsOptional()
  @IsString()
  severidadCodigo?: string;

  @IsOptional()
  @IsString()
  estadoCodigo?: string;
}
