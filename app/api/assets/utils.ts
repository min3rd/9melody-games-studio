export type ParsedNumericResult = { ok: true; value: number | null } | { ok: false };

export function parseNumericParam(value: unknown): ParsedNumericResult {
  if (value === null || value === undefined || value === "") {
    return { ok: true, value: null };
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed)) {
    return { ok: false };
  }
  return { ok: true, value: parsed };
}

export function parseIdParam(value: string | string[]) {
  const parsed = Number(Array.isArray(value) ? value[0] : value);
  if (Number.isNaN(parsed)) return null;
  return parsed;
}
