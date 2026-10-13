import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryRecetaDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  pacienteId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  medicoId?: number;

  @IsOptional()
  @IsString()
  estadoCodigo?: string;
}
