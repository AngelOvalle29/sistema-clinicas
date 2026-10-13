import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateEspecialidadDto {
  @ApiProperty()
  @IsString()
  @MaxLength(150)
  nombre: string;
}
