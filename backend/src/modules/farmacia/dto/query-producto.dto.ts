import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryProductoDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  busqueda?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tipoProductoId?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  soloActivos?: boolean;
}
