import { ApiProperty } from '@nestjs/swagger';
import { IsInt } from 'class-validator';

export class AjustarLoteDto {
  @ApiProperty({
    description:
      'Positivo suma, negativo resta. No puede dejar cantidad_actual en negativo.',
  })
  @IsInt()
  cantidad: number;
}
