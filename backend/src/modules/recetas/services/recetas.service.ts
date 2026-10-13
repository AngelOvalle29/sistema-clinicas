import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ProductosService } from '../../farmacia/services/productos.service';
import { LotesService } from '../../farmacia/services/lotes.service';
import { MedicosService } from '../../medicos/services/medicos.service';
import { PacientesService } from '../../pacientes/services/pacientes.service';
import { AlergiasService } from '../../historial/services/alergias.service';
import { CreateRecetaDto } from '../dto/create-receta.dto';
import { Receta } from '../entities/receta.entity';
import { RecetaDetalle } from '../entities/receta-detalle.entity';
import { EstadoRecetaCodigo } from '../enums/estado-receta.enum';
import { EstadoRecetaRepository } from '../repositories/estado-receta.repository';
import {
  FiltrosReceta,
  RecetaRepository,
} from '../repositories/receta.repository';
import { RecetaDetalleRepository } from '../repositories/receta-detalle.repository';

const ESTADOS_FINALES_PARA_DISPENSAR = [
  EstadoRecetaCodigo.ANULADA,
  EstadoRecetaCodigo.DISPENSADA,
];

@Injectable()
export class RecetasService {
  constructor(
    private readonly recetaRepository: RecetaRepository,
    private readonly recetaDetalleRepository: RecetaDetalleRepository,
    private readonly estadoRecetaRepository: EstadoRecetaRepository,
    private readonly pacientesService: PacientesService,
    private readonly medicosService: MedicosService,
    private readonly productosService: ProductosService,
    private readonly lotesService: LotesService,
    private readonly alergiasService: AlergiasService,
  ) {}

  async create(
    dto: CreateRecetaDto,
    usuarioActualId: number,
  ): Promise<{ receta: Receta; advertencias: string[] }> {
    const paciente = await this.pacientesService.validarActivoParaAtencion(
      dto.pacienteId,
    );
    const medico = await this.medicosService.findByUsuarioId(usuarioActualId);

    const estadoEmitida = await this.estadoRecetaRepository.findByCodigo(
      EstadoRecetaCodigo.EMITIDA,
    );
    if (!estadoEmitida) {
      throw new NotFoundException(
        'El catálogo estados_receta no tiene seedeado EMITIDA',
      );
    }

    const alergias = await this.alergiasService.findByPacienteId(
      dto.pacienteId,
    );
    const advertencias: string[] = [];

    const total = await this.recetaRepository.count();

    const receta = new Receta();
    receta.codigo = `REC-${String(total + 1).padStart(6, '0')}`;
    receta.paciente = paciente;
    receta.medico = medico;
    receta.estado = estadoEmitida;
    receta.fechaEmision = new Date();
    receta.vigenteHasta = new Date(dto.vigenteHasta);
    const recetaGuardada = await this.recetaRepository.save(receta);

    for (const detalleDto of dto.detalles) {
      const producto = await this.productosService.findById(
        detalleDto.productoId,
      );

      for (const alergia of alergias) {
        const descripcion = alergia.descripcion.toLowerCase();
        if (
          descripcion.includes(producto.nombre.toLowerCase()) ||
          (producto.principioActivo &&
            descripcion.includes(producto.principioActivo.toLowerCase()))
        ) {
          advertencias.push(
            `El producto "${producto.nombre}" podría coincidir con la alergia registrada: "${alergia.descripcion}"`,
          );
        }
      }

      const detalle = new RecetaDetalle();
      detalle.receta = recetaGuardada;
      detalle.producto = producto;
      detalle.cantidadPrescrita = detalleDto.cantidadPrescrita;
      detalle.cantidadDispensada = 0;
      detalle.indicaciones = detalleDto.indicaciones ?? null;
      await this.recetaDetalleRepository.save(detalle);
    }

    const recetaCompleta = await this.findById(recetaGuardada.id);
    return { receta: recetaCompleta, advertencias };
  }

  async findById(id: number): Promise<Receta> {
    const receta = await this.recetaRepository.findById(id);
    if (!receta) {
      throw new NotFoundException('Receta no encontrada');
    }
    return receta;
  }

  async findAll(page: number, limit: number, filtros: FiltrosReceta) {
    const [data, total] = await this.recetaRepository.findAndCount(
      (page - 1) * limit,
      limit,
      filtros,
    );
    return { data, total, page, limit };
  }

  async dispensar(id: number): Promise<Receta> {
    const receta = await this.findById(id);

    if (
      ESTADOS_FINALES_PARA_DISPENSAR.includes(
        receta.estado.codigo as EstadoRecetaCodigo,
      )
    ) {
      throw new BadRequestException(
        'La receta ya está en un estado final y no se puede dispensar',
      );
    }
    if (receta.vigenteHasta < new Date()) {
      throw new BadRequestException('La receta está vencida');
    }

    for (const detalle of receta.detalles) {
      const restante = detalle.cantidadPrescrita - detalle.cantidadDispensada;
      if (restante <= 0) {
        continue;
      }
      const dispensadoAhora = await this.lotesService.salidaFEFO(
        detalle.producto.id,
        restante,
        'receta_detalle',
        detalle.id,
      );
      detalle.cantidadDispensada += dispensadoAhora;
      await this.recetaDetalleRepository.save(detalle);
    }

    const todosCompletos = receta.detalles.every(
      (detalle) => detalle.cantidadDispensada >= detalle.cantidadPrescrita,
    );
    const algoDispensado = receta.detalles.some(
      (detalle) => detalle.cantidadDispensada > 0,
    );

    const nuevoCodigo = todosCompletos
      ? EstadoRecetaCodigo.DISPENSADA
      : algoDispensado
        ? EstadoRecetaCodigo.DISPENSADA_PARCIAL
        : (receta.estado.codigo as EstadoRecetaCodigo);

    const nuevoEstado =
      await this.estadoRecetaRepository.findByCodigo(nuevoCodigo);
    if (nuevoEstado) {
      receta.estado = nuevoEstado;
      await this.recetaRepository.save(receta);
    }

    return this.findById(id);
  }

  async anular(id: number): Promise<Receta> {
    const receta = await this.findById(id);
    if (
      (receta.estado.codigo as EstadoRecetaCodigo) ===
      EstadoRecetaCodigo.DISPENSADA
    ) {
      throw new BadRequestException(
        'No se puede anular una receta ya dispensada',
      );
    }
    if (
      (receta.estado.codigo as EstadoRecetaCodigo) ===
      EstadoRecetaCodigo.ANULADA
    ) {
      throw new BadRequestException('La receta ya está anulada');
    }

    const estadoAnulada = await this.estadoRecetaRepository.findByCodigo(
      EstadoRecetaCodigo.ANULADA,
    );
    if (!estadoAnulada) {
      throw new NotFoundException(
        'El catálogo estados_receta no tiene seedeado ANULADA',
      );
    }

    receta.estado = estadoAnulada;
    return this.recetaRepository.save(receta);
  }

  /** Regla 5.5: al registrar una defunción se anulan las recetas EMITIDA no dispensadas. */
  @OnEvent('paciente.fallecido')
  async onPacienteFallecido(payload: { pacienteId: number }): Promise<void> {
    const estadoAnulada = await this.estadoRecetaRepository.findByCodigo(
      EstadoRecetaCodigo.ANULADA,
    );
    if (!estadoAnulada) {
      return;
    }
    const emitidas = await this.recetaRepository.findByPacienteIdYEstadoCodigo(
      payload.pacienteId,
      EstadoRecetaCodigo.EMITIDA,
    );
    for (const receta of emitidas) {
      receta.estado = estadoAnulada;
      await this.recetaRepository.save(receta);
    }
  }
}
