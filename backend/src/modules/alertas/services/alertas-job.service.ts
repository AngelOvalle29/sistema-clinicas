import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CitasService } from '../../citas/services/citas.service';
import { PacienteEnfermedadesCronicasService } from '../../enfermedades-cronicas/services/paciente-enfermedades-cronicas.service';
import { RecetasService } from '../../recetas/services/recetas.service';
import { EstadoRecetaCodigo } from '../../recetas/enums/estado-receta.enum';
import { ConsultasService } from '../../historial/services/consultas.service';
import { SeveridadAlertaCodigo } from '../enums/severidad-alerta.enum';
import { TipoAlertaCodigo } from '../enums/tipo-alerta.enum';
import { AlertasService } from './alertas.service';

const DIAS_ANTES_SIN_CITA = 7;
const DIAS_ANTES_MEDICACION_POR_TERMINAR = 5;

@Injectable()
export class AlertasJobService {
  private readonly logger = new Logger(AlertasJobService.name);

  constructor(
    private readonly alertasService: AlertasService,
    private readonly pacienteEnfermedadesCronicasService: PacienteEnfermedadesCronicasService,
    private readonly consultasService: ConsultasService,
    private readonly citasService: CitasService,
    private readonly recetasService: RecetasService,
  ) {}

  @Cron('0 6 * * *')
  async ejecutarJobDiario(): Promise<void> {
    this.logger.log('Ejecutando job diario de alertas de pacientes crónicos');

    const activas =
      await this.pacienteEnfermedadesCronicasService.findTodasActivasConFrecuencia();

    const frecuenciaMinPorPaciente = new Map<number, number>();
    for (const { asignacion, frecuenciaControlDias } of activas) {
      const pacienteId = asignacion.paciente.id;
      const actual = frecuenciaMinPorPaciente.get(pacienteId);
      if (actual === undefined || frecuenciaControlDias < actual) {
        frecuenciaMinPorPaciente.set(pacienteId, frecuenciaControlDias);
      }
    }

    const hoy = new Date();

    for (const [
      pacienteId,
      frecuenciaDias,
    ] of frecuenciaMinPorPaciente.entries()) {
      await this.evaluarControlYCita(pacienteId, frecuenciaDias, hoy);
      await this.evaluarMedicacionPorTerminar(pacienteId, hoy);
    }
  }

  private async evaluarControlYCita(
    pacienteId: number,
    frecuenciaDias: number,
    hoy: Date,
  ): Promise<void> {
    const consultas = await this.consultasService.findByPacienteId(pacienteId);
    if (consultas.length === 0) {
      return;
    }

    const fechaLimite = new Date(consultas[0].fecha);
    fechaLimite.setDate(fechaLimite.getDate() + frecuenciaDias);

    const tieneFutura =
      await this.citasService.tieneFuturaProgramada(pacienteId);
    if (tieneFutura) {
      return;
    }

    const diasRestantes = Math.ceil(
      (fechaLimite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diasRestantes < 0) {
      await this.alertasService.crear(
        pacienteId,
        TipoAlertaCodigo.CONTROL_VENCIDO,
        SeveridadAlertaCodigo.ALTA,
        `El control periódico del paciente venció hace ${Math.abs(diasRestantes)} día(s) y no tiene cita futura.`,
      );
    } else if (diasRestantes <= DIAS_ANTES_SIN_CITA) {
      await this.alertasService.crear(
        pacienteId,
        TipoAlertaCodigo.SIN_CITA_PROGRAMADA,
        SeveridadAlertaCodigo.MEDIA,
        `Faltan ${diasRestantes} día(s) para el próximo control y el paciente no tiene cita programada.`,
      );
    }
  }

  private async evaluarMedicacionPorTerminar(
    pacienteId: number,
    hoy: Date,
  ): Promise<void> {
    const { data: recetas } = await this.recetasService.findAll(1, 1000, {
      pacienteId,
    });

    const limite = new Date(hoy);
    limite.setDate(limite.getDate() + DIAS_ANTES_MEDICACION_POR_TERMINAR);

    const porTerminar = recetas.some((receta) => {
      const vigente =
        (receta.estado.codigo as EstadoRecetaCodigo) ===
          EstadoRecetaCodigo.EMITIDA ||
        (receta.estado.codigo as EstadoRecetaCodigo) ===
          EstadoRecetaCodigo.DISPENSADA_PARCIAL;
      return (
        vigente && receta.vigenteHasta >= hoy && receta.vigenteHasta <= limite
      );
    });

    if (porTerminar) {
      await this.alertasService.crear(
        pacienteId,
        TipoAlertaCodigo.MEDICACION_POR_TERMINAR,
        SeveridadAlertaCodigo.MEDIA,
        `El paciente tiene una receta vigente que termina en los próximos ${DIAS_ANTES_MEDICACION_POR_TERMINAR} días.`,
      );
    }
  }
}
