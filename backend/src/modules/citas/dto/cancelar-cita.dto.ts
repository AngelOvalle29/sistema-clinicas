import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CancelarCitaDto {
  @ApiProperty()
  @IsString()
  @MaxLength(255)
  motivo: string;
}
