import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { Alerta } from '../entities/alerta.entity';
import { EstadoAlertaCodigo } from '../enums/estado-alerta.enum';
import { SeveridadAlertaCodigo } from '../enums/severidad-alerta.enum';
import { TipoAlertaCodigo } from '../enums/tipo-alerta.enum';
import {
  AlertaRepository,
  FiltrosAlerta,
} from '../repositories/alerta.repository';
import { EstadoAlertaRepository } from '../repositories/estado-alerta.repository';
import { SeveridadAlertaRepository } from '../repositories/severidad-alerta.repository';
import { TipoAlertaRepository } from '../repositories/tipo-alerta.repository';

@Injectable()
export class AlertasService {
  constructor(
    private readonly alertaRepository: AlertaRepository,
    private readonly tipoAlertaRepository: TipoAlertaRepository,
    private readonly severidadAlertaRepository: SeveridadAlertaRepository,
    private readonly estadoAlertaRepository: EstadoAlertaRepository,
    private readonly pacientesService: PacientesService,
  ) {}

  /** Regla 5.8: no duplicar si ya existe una PENDIENTE del mismo tipo para el mismo paciente. */
  async crear(
    pacienteId: number,
    tipoAlertaCodigo: TipoAlertaCodigo,
    severidadCodigo: SeveridadAlertaCodigo,
    mensaje: string,
  ): Promise<Alerta | null> {
    const existente = await this.alertaRepository.findPendienteDuplicada(
      pacienteId,
      tipoAlertaCodigo,
    );
    if (existente) {
      return null;
    }

    const paciente = await this.pacientesService.findById(pacienteId);
    const tipoAlerta =
      await this.tipoAlertaRepository.findByCodigo(tipoAlertaCodigo);
    const severidad =
      await this.severidadAlertaRepository.findByCodigo(severidadCodigo);
    const estadoPendiente = await this.estadoAlertaRepository.findByCodigo(
      EstadoAlertaCodigo.PENDIENTE,
    );
    if (!tipoAlerta || !severidad || !estadoPendiente) {
      throw new NotFoundException(
        'Los catálogos de alertas no están completamente seedeados',
      );
    }

    const alerta = new Alerta();
    alerta.paciente = paciente;
    alerta.tipoAlerta = tipoAlerta;
    alerta.severidad = severidad;
    alerta.estado = estadoPendiente;
    alerta.mensaje = mensaje;
    alerta.fechaGenerada = new Date();
    alerta.fechaAtendida = null;

    return this.alertaRepository.save(alerta);
  }

  async findAll(page: number, limit: number, filtros: FiltrosAlerta) {
    const [data, total] = await this.alertaRepository.findAndCount(
      (page - 1) * limit,
      limit,
      filtros,
    );
    return { data, total, page, limit };
  }

  async findById(id: number): Promise<Alerta> {
    const alerta = await this.alertaRepository.findById(id);
    if (!alerta) {
      throw new NotFoundException('Alerta no encontrada');
    }
    return alerta;
  }

  contarPendientes(): Promise<number> {
    return this.alertaRepository.countPendientes();
  }

  async marcarVista(id: number): Promise<Alerta> {
    const alerta = await this.findById(id);
    if (
      (alerta.estado.codigo as EstadoAlertaCodigo) !==
      EstadoAlertaCodigo.PENDIENTE
    ) {
      throw new BadRequestException(
        'Solo una alerta PENDIENTE puede marcarse como VISTA',
      );
    }
    const estadoVista = await this.estadoAlertaRepository.findByCodigo(
      EstadoAlertaCodigo.VISTA,
    );
    if (!estadoVista) {
      throw new NotFoundException(
        'El catálogo estados_alerta no tiene seedeado VISTA',
      );
    }
    alerta.estado = estadoVista;
    return this.alertaRepository.save(alerta);
  }

  async atender(id: number): Promise<Alerta> {
    const alerta = await this.findById(id);
    if (
      (alerta.estado.codigo as EstadoAlertaCodigo) ===
      EstadoAlertaCodigo.ATENDIDA
    ) {
      throw new BadRequestException('La alerta ya está atendida');
    }
    const estadoAtendida = await this.estadoAlertaRepository.findByCodigo(
      EstadoAlertaCodigo.ATENDIDA,
    );
    if (!estadoAtendida) {
      throw new NotFoundException(
        'El catálogo estados_alerta no tiene seedeado ATENDIDA',
      );
    }
    alerta.estado = estadoAtendida;
    alerta.fechaAtendida = new Date();
    return this.alertaRepository.save(alerta);
  }

  async descartar(id: number): Promise<Alerta> {
    const alerta = await this.findById(id);
    if (
      (alerta.estado.codigo as EstadoAlertaCodigo) ===
      EstadoAlertaCodigo.DESCARTADA
    ) {
      throw new BadRequestException('La alerta ya está descartada');
    }
    const estadoDescartada = await this.estadoAlertaRepository.findByCodigo(
      EstadoAlertaCodigo.DESCARTADA,
    );
    if (!estadoDescartada) {
      throw new NotFoundException(
        'El catálogo estados_alerta no tiene seedeado DESCARTADA',
      );
    }
    alerta.estado = estadoDescartada;
    alerta.fechaAtendida = new Date();
    return this.alertaRepository.save(alerta);
  }

  /** Regla 5.5: el job/las alertas deben ignorar pacientes fallecidos; descartamos las pendientes. */
  @OnEvent('paciente.fallecido')
  async onPacienteFallecido(payload: { pacienteId: number }): Promise<void> {
    const { data: pendientes } = await this.findAll(1, 1000, {
      pacienteId: payload.pacienteId,
      estadoCodigo: EstadoAlertaCodigo.PENDIENTE,
    });
    for (const alerta of pendientes) {
      await this.descartar(alerta.id);
    }
  }

  /** Evento emitido por `historial` al registrar signos vitales fuera de rango. */
  @OnEvent('signos-vitales.fuera-de-rango')
  async onSignosVitalesFueraDeRango(payload: {
    pacienteId: number;
    consultaId: number;
    valoresFueraDeRango: string[];
  }): Promise<void> {
    const severidad = payload.valoresFueraDeRango.includes('saturacionO2')
      ? SeveridadAlertaCodigo.CRITICA
      : SeveridadAlertaCodigo.ALTA;
    const mensaje = `Signos vitales fuera de rango en la consulta #${payload.consultaId}: ${payload.valoresFueraDeRango.join(', ')}`;
    await this.crear(
      payload.pacienteId,
      TipoAlertaCodigo.VALOR_FUERA_RANGO,
      severidad,
      mensaje,
    );
  }
}
