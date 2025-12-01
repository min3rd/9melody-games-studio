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

// Reset password for a specific user (admin-only flow assumed at UI level)
export async function POST(request: NextRequest, context: any) {
  const id = parseId(context?.params?.id);
  if (!id) return NextResponse.json(formatError(ErrorCodes.INVALID_ID), { status: 400 });
  const body = await request.json().catch(() => ({}));
  const { action, newPassword, disabled } = body as { action?: string; newPassword?: string; disabled?: boolean };
  try {
    if (action === 'reset-password') {
      if (!newPassword || String(newPassword).length < 6) {
        return NextResponse.json(formatError(ErrorCodes.PASSWORD_TOO_SHORT ?? ErrorCodes.PASSWORD_REQUIRED), { status: 400 });
      }
      const hashed = await (await import('bcryptjs')).default.hash(newPassword, 10);
      const updated = await prisma.user.update({ where: { id }, data: { passwordHash: hashed } });
      return NextResponse.json({ ok: true, id: updated.id });
    }
    if (action === 'disable') {
      const updated = await prisma.user.update({ where: { id }, data: { disabled: disabled ?? true } });
      return NextResponse.json({ ok: true, disabled: updated.disabled });
    }
    if (action === 'revoke-sessions') {
      const updated = await prisma.user.update({ where: { id }, data: { sessionVersion: { increment: 1 } } });
      return NextResponse.json({ ok: true, sessionVersion: updated.sessionVersion });
    }
    return NextResponse.json(formatError(ErrorCodes.INVALID_REQUEST ?? ErrorCodes.INTERNAL_ERROR), { status: 400 });
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
