/**
 * Códigos de `tipos_movimiento_inventario` que el service usa al generar
 * movimientos (AGENTS.md 5.9). No es columna enum.
 */
export enum TipoMovimientoInventarioCodigo {
  ENTRADA = 'ENTRADA',
  SALIDA = 'SALIDA',
  AJUSTE = 'AJUSTE',
  VENCIMIENTO = 'VENCIMIENTO',
}
