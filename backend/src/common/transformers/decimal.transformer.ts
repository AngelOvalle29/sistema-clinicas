import { ValueTransformer } from 'typeorm';

/**
 * mysql2 devuelve columnas `decimal` como string; este transformer las
 * convierte a `number` al leer (AGENTS.md sección 6: "usar un transformer").
 */
export const decimalTransformer: ValueTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value === null || value === undefined ? null : Number(value),
};
