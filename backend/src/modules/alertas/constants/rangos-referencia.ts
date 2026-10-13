/**
 * Rangos de referencia iniciales para signos vitales (AGENTS.md 5.8).
 * Constantes fáciles de ajustar sin tocar la lógica del service.
 */
export const RANGOS_REFERENCIA = {
  GLUCOSA_MAX: 180,
  GLUCOSA_MIN: 70,
  PRESION_SISTOLICA_MAX: 140,
  PRESION_DIASTOLICA_MAX: 90,
  SATURACION_O2_MIN: 92,
} as const;
