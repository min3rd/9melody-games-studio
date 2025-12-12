import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

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

export async function hasNameConflict(
  name: string,
  parentId: number | null,
  type: "FOLDER" | "FILE",
  excludeId?: number
) {
  const where: Prisma.AssetWhereInput = {
    parentId,
    type,
    name: { equals: name, mode: "insensitive" },
  };
  if (excludeId) {
    where.id = { not: excludeId };
  }
  const existing = await prisma.asset.findFirst({ where, select: { id: true } });
  return Boolean(existing);
}
