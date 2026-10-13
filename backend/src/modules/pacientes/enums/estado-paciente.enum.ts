/**
 * Códigos de `estados_paciente` que el service compara en validaciones
 * (defunción, bloqueo de atención a inactivos/fallecidos). No es columna enum:
 * `estados_paciente` es tabla catálogo, esto es el conjunto de literales
 * que debe existir seedeado.
 */
export enum EstadoPacienteCodigo {
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
  FALLECIDO = 'FALLECIDO',
}
