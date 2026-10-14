// Fechas en hora local (Guatemala), no UTC: toISOString() adelanta el día después de las 18:00.

function aLocal(d: Date): string {
  const copia = new Date(d);
  copia.setMinutes(copia.getMinutes() - copia.getTimezoneOffset());
  return copia.toISOString();
}

/** YYYY-MM-DD de hoy en hora local. */
export function hoyLocal(): string {
  return aLocal(new Date()).slice(0, 10);
}

/** YYYY-MM-DDTHH:mm (formato de <input type="datetime-local">) en hora local. */
export function fechaHoraLocal(d: Date = new Date()): string {
  return aLocal(d).slice(0, 16);
}

/** Suma minutos a un valor de <input type="datetime-local">. */
export function sumarMinutos(valor: string, minutos: number): string {
  const d = new Date(valor);
  d.setMinutes(d.getMinutes() + minutos);
  return fechaHoraLocal(d);
}
