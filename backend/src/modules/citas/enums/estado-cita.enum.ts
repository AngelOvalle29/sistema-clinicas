/**
 * Códigos de `estados_cita` que el service compara al validar transiciones
 * (AGENTS.md 5.6). No es columna enum: `estados_cita` es tabla catálogo,
 * esto es el conjunto de literales que debe existir seedeado.
 */
export enum EstadoCitaCodigo {
  PROGRAMADA = 'PROGRAMADA',
  CONFIRMADA = 'CONFIRMADA',
  EN_CURSO = 'EN_CURSO',
  COMPLETADA = 'COMPLETADA',
  CANCELADA = 'CANCELADA',
  NO_ASISTIO = 'NO_ASISTIO',
}
