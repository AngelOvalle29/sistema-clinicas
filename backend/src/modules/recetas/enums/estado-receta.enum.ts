/**
 * Códigos de `estados_receta` que el service compara al dispensar/anular
 * (AGENTS.md 5.10). No es columna enum.
 */
export enum EstadoRecetaCodigo {
  EMITIDA = 'EMITIDA',
  DISPENSADA_PARCIAL = 'DISPENSADA_PARCIAL',
  DISPENSADA = 'DISPENSADA',
  ANULADA = 'ANULADA',
}
