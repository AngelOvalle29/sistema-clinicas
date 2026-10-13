/**
 * Único enum que no se normalizó a catálogo (ver Note de `auditoria_logs` en schema.dbml):
 * conjunto cerrado atado al subscriber de TypeORM y a AuthService, no editable desde la UI.
 */
export enum AccionAuditoria {
  INSERT = 'INSERT',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
}
