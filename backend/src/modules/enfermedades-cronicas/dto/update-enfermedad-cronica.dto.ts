import { PartialType } from '@nestjs/swagger';
import { CreateEnfermedadCronicaDto } from './create-enfermedad-cronica.dto';

export class UpdateEnfermedadCronicaDto extends PartialType(
  CreateEnfermedadCronicaDto,
) {}
