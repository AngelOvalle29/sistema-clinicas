export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export type RolCodigo = "ADMIN" | "MEDICO" | "RECEPCION" | "FARMACIA";
