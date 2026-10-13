import {
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { RANGOS_REFERENCIA } from '../../alertas/constants/rangos-referencia';
import { MedicosService } from '../../medicos/services/medicos.service';
import { RegistrarSignosVitalesDto } from '../dto/registrar-signos-vitales.dto';
import { SignoVital } from '../entities/signo-vital.entity';
import { SignoVitalRepository } from '../repositories/signo-vital.repository';
import { ConsultasService } from './consultas.service';

@Injectable()
export class SignosVitalesService {
  constructor(
    private readonly signoVitalRepository: SignoVitalRepository,
    private readonly consultasService: ConsultasService,
    private readonly medicosService: MedicosService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async registrar(
    consultaId: number,
    dto: RegistrarSignosVitalesDto,
    usuarioActualId: number,
  ): Promise<SignoVital> {
    const consulta = await this.consultasService.findById(consultaId);
    const medicoActual =
      await this.medicosService.findByUsuarioId(usuarioActualId);
    if (consulta.medico.id !== medicoActual.id) {
      throw new ForbiddenException(
        'Solo el médico autor de la consulta puede registrar sus signos vitales',
      );
    }

    const existente =
      await this.signoVitalRepository.findByConsultaId(consultaId);
    if (existente) {
      throw new ConflictException(
        'Esa consulta ya tiene signos vitales registrados',
      );
    }

    const signoVital = new SignoVital();
    signoVital.consulta = consulta;
    signoVital.presionSistolica = dto.presionSistolica ?? null;
    signoVital.presionDiastolica = dto.presionDiastolica ?? null;
    signoVital.glucosa = dto.glucosa ?? null;
    signoVital.saturacionO2 = dto.saturacionO2 ?? null;
    signoVital.temperatura = dto.temperatura ?? null;
    signoVital.peso = dto.peso ?? null;
    signoVital.talla = dto.talla ?? null;

    const guardado = await this.signoVitalRepository.save(signoVital);

    const fueraDeRango = this.detectarValoresFueraDeRango(signoVital);
    if (fueraDeRango.length > 0) {
      this.eventEmitter.emit('signos-vitales.fuera-de-rango', {
        pacienteId: consulta.paciente.id,
        consultaId,
        valoresFueraDeRango: fueraDeRango,
      });
    }

    return guardado;
  }

  findByConsultaId(consultaId: number): Promise<SignoVital | null> {
    return this.signoVitalRepository.findByConsultaId(consultaId);
  }

  private detectarValoresFueraDeRango(signoVital: SignoVital): string[] {
    const fueraDeRango: string[] = [];

    if (
      signoVital.glucosa !== null &&
      (signoVital.glucosa > RANGOS_REFERENCIA.GLUCOSA_MAX ||
        signoVital.glucosa < RANGOS_REFERENCIA.GLUCOSA_MIN)
    ) {
      fueraDeRango.push('glucosa');
    }
    if (
      signoVital.presionSistolica !== null &&
      signoVital.presionSistolica >= RANGOS_REFERENCIA.PRESION_SISTOLICA_MAX
    ) {
      fueraDeRango.push('presionSistolica');
    }
    if (
      signoVital.presionDiastolica !== null &&
      signoVital.presionDiastolica >= RANGOS_REFERENCIA.PRESION_DIASTOLICA_MAX
    ) {
      fueraDeRango.push('presionDiastolica');
    }
    if (
      signoVital.saturacionO2 !== null &&
      signoVital.saturacionO2 < RANGOS_REFERENCIA.SATURACION_O2_MIN
    ) {
      fueraDeRango.push('saturacionO2');
    }

    return fueraDeRango;
  }
}
