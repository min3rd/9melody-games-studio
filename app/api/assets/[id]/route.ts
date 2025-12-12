import fs from "node:fs/promises";
import path from "node:path";
import { prisma } from "@/lib/prisma";
import { ErrorCodes, formatError } from "@/lib/errorCodes";
import { requireAdminFromRequest } from "@/lib/apiAuth";
import { parseIdParam, parseNumericParam } from "../utils";
import { NextRequest, NextResponse } from "next/server";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FOLDER_DEPTH = 50;

async function ensureParentFolder(parentId: number | null, assetId: number) {
  if (parentId === null) return { ok: true as const };
  if (parentId === assetId) {
    return { ok: false as const, status: 400, body: formatError(ErrorCodes.ASSET_PARENT_INVALID) };
  }
  const parent = await prisma.asset.findUnique({ where: { id: parentId }, select: { id: true, parentId: true, type: true } });
  if (!parent || parent.type !== "FOLDER") {
    return { ok: false as const, status: 400, body: formatError(ErrorCodes.ASSET_PARENT_INVALID) };
  }

  // prevent circular parenting by walking ancestors
  let currentParent: number | null = parent.parentId;
  let depth = 0;
  while (currentParent !== null && depth < MAX_FOLDER_DEPTH) {
    if (currentParent === assetId) {
      return { ok: false as const, status: 400, body: formatError(ErrorCodes.ASSET_PARENT_INVALID) };
    }
    const ancestor = await prisma.asset.findUnique({ where: { id: currentParent }, select: { parentId: true } });
    currentParent = ancestor?.parentId ?? null;
    depth += 1;
  }

  return { ok: true as const, parentId };
}

async function deleteLocalFile(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return;
  const relative = url.replace("/uploads/", "");
  const filePath = path.join(UPLOAD_DIR, relative);
  try {
    await fs.unlink(filePath);
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err?.code === "ENOENT") return;
    console.error("Failed to delete asset file", error);
  }
}

async function collectLocalFiles(rootId: number, rootUrl: string | null) {
  const urls: string[] = [];
  if (rootUrl?.startsWith("/uploads/")) {
    urls.push(rootUrl);
  }

  const queue: number[] = [rootId];
  while (queue.length) {
    const current = queue.pop();
    if (!current) continue;
    const children = await prisma.asset.findMany({
      where: { parentId: current },
      select: { id: true, url: true, type: true },
    });

    for (const child of children) {
      if (child.url?.startsWith("/uploads/") && child.type === "FILE") {
        urls.push(child.url);
      }
      queue.push(child.id);
    }
  }

  return urls;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(formatError(ErrorCodes.NOT_AUTHORIZED), { status: 403 });
  }

  const id = parseIdParam(params.id);
  if (id === null) {
    return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  }

  const includeChildren = new URL(request.url).searchParams.get("includeChildren") === "true";
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: includeChildren ? { children: true } : undefined,
  });

  if (!asset) {
    return NextResponse.json(formatError(ErrorCodes.ASSET_NOT_FOUND), { status: 404 });
  }

  return NextResponse.json(asset);
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(formatError(ErrorCodes.NOT_AUTHORIZED), { status: 403 });
  }

  const id = parseIdParam(params.id);
  if (id === null) {
    return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  }

  const existing = await prisma.asset.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json(formatError(ErrorCodes.ASSET_NOT_FOUND), { status: 404 });
  }

  const body = await request.json();
  const { name, previewUrl, parentId: rawParentId, metadata, url, mimeType, size, extension, kind } = body ?? {};

  const data: {
    name?: string;
    previewUrl?: string | null;
    parentId?: number | null;
    metadata?: Record<string, unknown> | null;
    url?: string | null;
    mimeType?: string | null;
    size?: number | null;
    extension?: string | null;
    kind?: string | null;
  } = {};

  if (typeof name === "string" && name.length) {
    data.name = name;
  }
  if (typeof previewUrl === "string") {
    data.previewUrl = previewUrl;
  }
  if (rawParentId !== undefined) {
    const parentResult = parseNumericParam(rawParentId);
    if (!parentResult.ok) {
      return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
    }
    const parentId = parentResult.value;
    const parentCheck = await ensureParentFolder(parentId, id);
    if (!parentCheck.ok) {
      return NextResponse.json(parentCheck.body, { status: parentCheck.status });
    }
    data.parentId = parentId;
  }
  if (metadata === null) data.metadata = null;
  else if (metadata && typeof metadata === "object") data.metadata = metadata;

  if (typeof url === "string") data.url = url;
  if (typeof mimeType === "string") data.mimeType = mimeType;
  if (typeof size === "number") data.size = size;
  if (typeof extension === "string") data.extension = extension;
  if (typeof kind === "string") data.kind = kind;

  const updated = await prisma.asset.update({ where: { id }, data });
  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(formatError(ErrorCodes.NOT_AUTHORIZED), { status: 403 });
  }

  const id = parseIdParam(params.id);
  if (id === null) {
    return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  }

  const asset = await prisma.asset.findUnique({
    where: { id },
    select: { id: true, url: true, type: true },
  });

  if (!asset) {
    return NextResponse.json(formatError(ErrorCodes.ASSET_NOT_FOUND), { status: 404 });
  }

  const localFiles = await collectLocalFiles(asset.id, asset.url);

  await prisma.asset.delete({ where: { id } });

  for (const fileUrl of localFiles) {
    await deleteLocalFile(fileUrl);
  }

  return NextResponse.json({ ok: true });
}
