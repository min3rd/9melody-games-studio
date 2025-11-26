import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ErrorCodes, formatError } from '@/lib/errorCodes';
import type { NextRequest } from 'next/server';

function parseId(id: string | string[] | undefined) {
  if (!id) return null;
  const s = Array.isArray(id) ? id[0] : id;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export async function GET(request: NextRequest, context: any) {
  const id = parseId(context?.params?.id);
  if (!id) return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json(formatError(ErrorCodes.USER_NOT_FOUND), { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest, context: any) {
  const id = parseId(context?.params?.id);
  if (!id) return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  const body = await request.json();
  try {
    const user = await prisma.user.update({ where: { id }, data: body });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ ...formatError(ErrorCodes.INTERNAL_ERROR), message: err?.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: any) {
  const id = parseId(context?.params?.id);
  if (!id) return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  try {
    const deleted = await prisma.user.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ ...formatError(ErrorCodes.INTERNAL_ERROR), message: err?.message }, { status: 500 });
  }
}
