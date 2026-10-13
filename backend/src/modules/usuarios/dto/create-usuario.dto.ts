import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { RolCodigo } from '../../../common/enums/rol-codigo.enum';

export class CreateUsuarioDto {
  @ApiProperty()
  @IsString()
  nombres: string;

  @ApiProperty()
  @IsString()
  apellidos: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: RolCodigo })
  @IsEnum(RolCodigo)
  rolCodigo: RolCodigo;
}
