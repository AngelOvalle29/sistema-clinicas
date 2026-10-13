import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryPacienteDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  dpi?: string;

  @IsOptional()
  @IsString()
  estadoCodigo?: string;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  soloPrioritarios?: boolean;
}
