import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateAntecedenteDto {
  @ApiProperty()
  @IsString()
  @MaxLength(50)
  tipo: string;

  @ApiProperty()
  @IsString()
  @MaxLength(500)
  descripcion: string;
}
