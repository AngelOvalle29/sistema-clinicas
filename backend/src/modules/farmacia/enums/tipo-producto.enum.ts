/**
 * Códigos de `tipos_producto` que el service compara (p. ej. para forzar
 * costo_unitario = 0 en muestras médicas, AGENTS.md 5.9). No es columna enum.
 */
export enum TipoProductoCodigo {
  MEDICAMENTO = 'MEDICAMENTO',
  MUESTRA_MEDICA = 'MUESTRA_MEDICA',
  INSUMO = 'INSUMO',
}
