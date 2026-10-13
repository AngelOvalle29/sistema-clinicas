import { Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryMedicoDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  especialidadId?: number;
}
