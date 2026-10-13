import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, MaxLength } from 'class-validator';

export class CreateMedicoDto {
  @ApiProperty()
  @IsInt()
  usuarioId: number;

  @ApiProperty()
  @IsInt()
  especialidadId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  numeroColegiado: string;
}
