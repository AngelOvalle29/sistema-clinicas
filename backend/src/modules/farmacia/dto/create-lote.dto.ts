import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, IsString, Min, MaxLength } from 'class-validator';

export class CreateLoteDto {
  @ApiProperty()
  @IsInt()
  productoId: number;

  @ApiProperty()
  @IsString()
  @MaxLength(50)
  numeroLote: string;

  @ApiProperty()
  @IsDateString()
  fechaVencimiento: string;

  @ApiProperty()
  @IsInt()
  @Min(0)
  cantidadInicial: number;
}
