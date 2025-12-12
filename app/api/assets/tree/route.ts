import { NextRequest, NextResponse } from "next/server";
import { requireAdminFromRequest } from "@/lib/apiAuth";
import { prisma } from "@/lib/prisma";
import { ErrorCodes, formatError } from "@/lib/errorCodes";

type AssetTreeNode = {
  id: number;
  name: string;
  type: "FOLDER" | "FILE";
  parentId: number | null;
  previewUrl: string | null;
  kind: string | null;
  children: AssetTreeNode[];
};

export async function GET(request: NextRequest) {
  const admin = await requireAdminFromRequest(request);
  if (!admin) {
    return NextResponse.json(formatError(ErrorCodes.NOT_AUTHORIZED), { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const foldersOnly = searchParams.get("foldersOnly") === "true";

  const assets = await prisma.asset.findMany({
    where: foldersOnly ? { type: "FOLDER" } : undefined,
    select: { id: true, name: true, type: true, parentId: true, previewUrl: true, kind: true },
    orderBy: [
      { type: "asc" },
      { name: "asc" },
    ],
  });

  const nodes: AssetTreeNode[] = assets.map((asset) => ({
    ...asset,
    children: [],
  }));

  const map = new Map<number, AssetTreeNode>();
  nodes.forEach((node) => map.set(node.id, node));

  const roots: AssetTreeNode[] = [];

  nodes.forEach((node) => {
    if (node.parentId !== null && map.has(node.parentId)) {
      map.get(node.parentId)?.children.push(node);
    } else {
      roots.push(node);
    }
  });

  return NextResponse.json({ items: roots });
}
