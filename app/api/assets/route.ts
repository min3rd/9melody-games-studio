import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { ErrorCodes, formatError } from "@/lib/errorCodes";
import { requireAdminFromRequest } from "@/lib/apiAuth";
import { hasNameConflict, parseNumericParam } from "./utils";
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MODEL_EXTENSIONS = new Set(["gltf", "glb", "fbx", "obj", "stl", "dae"]);
const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif", "bmp", "tiff", "tif"]);

type ParentValidationResult =
  | { ok: true }
  | { ok: true; parentId: number }
  | { ok: false; status: number; body: unknown };

function inferKind(extension?: string, mimeType?: string | null) {
  const ext = extension?.toLowerCase();
  if (ext && MODEL_EXTENSIONS.has(ext)) return "model";
  if (ext && IMAGE_EXTENSIONS.has(ext)) return "image";
  if (mimeType?.startsWith("image/")) return "image";
  if (mimeType?.includes("gltf") || mimeType?.includes("fbx") || mimeType?.includes("obj")) {
    return "model";
  }
  return "file";
}

async function ensureParentFolder(parentId: number | null): Promise<ParentValidationResult> {
  if (parentId === null) return { ok: true };
  const parent = await prisma.asset.findUnique({ where: { id: parentId } });
  if (!parent) {
    return { ok: false, status: 404, body: formatError(ErrorCodes.ASSET_PARENT_INVALID) };
  }
  if (parent.type !== "FOLDER") {
    return { ok: false, status: 400, body: formatError(ErrorCodes.ASSET_PARENT_INVALID) };
  }
  return { ok: true, parentId };
}

function normalizeExtension(name: string, mimeType?: string | null) {
  const ext = path.extname(name || "").replace(".", "").toLowerCase();
  if (ext) return ext;
  if (mimeType && mimeType.includes("/")) {
    const parts = mimeType.split("/");
    if (parts[1]) return parts[1];
  }
  return undefined;
}

function parseMetadata(value: FormDataEntryValue | null | undefined) {
  if (typeof value !== "string") return undefined;
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "object" && parsed !== null ? parsed : undefined;
  } catch (error: unknown) {
    console.error("Failed to parse asset metadata", error);
    return undefined;
  }
}

async function saveFileToDisk(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const extension = normalizeExtension(file.name, file.type);
  const fileName = `${randomUUID()}.${extension ?? "dat"}`;
  const destination = path.join(UPLOAD_DIR, fileName);
  await fs.writeFile(destination, buffer);

  return {
    url: `/uploads/${fileName}`,
    size: buffer.byteLength,
    extension,
    mimeType: file.type || null,
    kind: inferKind(extension, file.type),
  };
}

export async function GET(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(formatError(ErrorCodes.NOT_AUTHORIZED), { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const parentIdParam = searchParams.get("parentId");
  const kind = searchParams.get("kind");
  const query = searchParams.get("q");

  const parentIdResult = parseNumericParam(parentIdParam);
  if (!parentIdResult.ok) {
    return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  }
  const parentId = parentIdResult.value;

  const where: {
    parentId?: number | null;
    kind?: string;
    name?: { contains: string; mode: "insensitive" };
  } = {};

  where.parentId = parentId;
  if (kind) where.kind = kind;
  if (query) {
    // Case-insensitive filtering relies on database support (e.g., PostgreSQL) via mode: "insensitive"
    where.name = { contains: query, mode: "insensitive" };
  }

  const assets = await prisma.asset.findMany({
    where,
    orderBy: [
      { type: "asc" },
      { name: "asc" },
    ],
  });

  return NextResponse.json({ items: assets });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(formatError(ErrorCodes.NOT_AUTHORIZED), { status: 403 });
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const parentIdResult = parseNumericParam(formData.get("parentId"));
    if (!parentIdResult.ok) {
      return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
    }
    const parentId = parentIdResult.value;

    const parentCheck = await ensureParentFolder(parentId);
    if (!parentCheck.ok) {
      return NextResponse.json(parentCheck.body, { status: parentCheck.status });
    }

    const files = formData.getAll("file").filter((entry): entry is File => entry instanceof File);
    if (!files.length) {
      return NextResponse.json(formatError(ErrorCodes.ASSET_UPLOAD_REQUIRED), { status: 400 });
    }

    const metadata = parseMetadata(formData.get("metadata"));
    const previewOverride = formData.get("previewUrl");
    const created = [];

    for (const file of files) {
      const saved = await saveFileToDisk(file);
      const previewUrl =
        typeof previewOverride === "string"
          ? previewOverride
          : saved.kind === "image"
            ? saved.url
            : undefined;

      const asset = await prisma.asset.create({
        data: {
          name: file.name || "asset",
          type: "FILE",
          parentId,
          url: saved.url,
          previewUrl,
          mimeType: saved.mimeType,
          size: saved.size,
          extension: saved.extension,
          kind: saved.kind,
          metadata,
        },
      });

      created.push(asset);
    }

    return NextResponse.json({ items: created }, { status: 201 });
  }

  const body = await request.json();
  const { name, type, parentId: rawParentId, url, previewUrl, mimeType, size, extension, kind, metadata } = body ?? {};

  if (!name) {
    return NextResponse.json(formatError(ErrorCodes.ASSET_NAME_REQUIRED), { status: 400 });
  }

  const parentIdResult = parseNumericParam(rawParentId ?? null);
  if (!parentIdResult.ok) {
    return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  }
  const parentId = parentIdResult.value;

  const parentCheck = await ensureParentFolder(parentId);
  if (!parentCheck.ok) {
    return NextResponse.json(parentCheck.body, { status: parentCheck.status });
  }

  const normalizedType = String(type || "FILE").toUpperCase() === "FOLDER" ? "FOLDER" : "FILE";
  const inferredExtension = extension ?? normalizeExtension(name, mimeType);
  const inferredKind = kind ?? inferKind(inferredExtension, mimeType);
  const payloadMetadata =
    metadata && typeof metadata === "object" ? metadata : undefined;

  const hasConflict = await hasNameConflict(name, parentId, normalizedType, undefined);
  if (hasConflict) {
    return NextResponse.json(formatError(ErrorCodes.ASSET_NAME_CONFLICT), { status: 409 });
  }

  const asset = await prisma.asset.create({
    data: {
      name,
      type: normalizedType,
      parentId,
      url,
      previewUrl: previewUrl ?? (inferredKind === "image" ? url : undefined),
      mimeType: mimeType ?? null,
      size: typeof size === "number" ? size : null,
      extension: inferredExtension,
      kind: inferredKind,
      metadata: payloadMetadata,
    },
  });

  return NextResponse.json(asset, { status: 201 });
}
