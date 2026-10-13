import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateAlergiaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  descripcion: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(30)
  severidad?: string;
}
