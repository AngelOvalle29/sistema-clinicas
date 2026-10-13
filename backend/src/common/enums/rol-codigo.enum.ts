/**
 * Códigos de rol usados en `@Roles()` y en el seed de `roles`.
 * No es un enum de columna: `roles` es tabla catálogo (roles.codigo varchar),
 * esto es solo el conjunto de literales que el código espera encontrar seedeados.
 */
export enum RolCodigo {
  ADMIN = 'ADMIN',
  MEDICO = 'MEDICO',
  RECEPCION = 'RECEPCION',
  FARMACIA = 'FARMACIA',
}
