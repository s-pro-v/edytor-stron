export type DbRow = Record<string, unknown>;

export function parseJsonField<T = unknown>(value: unknown): T {
  if (typeof value !== "string") return value as T;
  return JSON.parse(value) as T;
}

export function mapRows<T extends DbRow>(rows: unknown[], mapper: (row: DbRow) => T): T[] {
  return rows.map((row) => mapper(row as DbRow));
}
