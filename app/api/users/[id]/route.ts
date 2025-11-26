import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

function parseId(id: string | string[] | undefined) {
  if (!id) return null;
  const s = Array.isArray(id) ? id[0] : id;
  const n = Number(s);
  return Number.isNaN(n) ? null : n;
}

export async function GET(request: NextRequest, { params }: { params: { id?: string } }) {
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest, { params }: { params: { id?: string } }) {
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  const body = await request.json();
  try {
    const user = await prisma.user.update({ where: { id }, data: body });
    return NextResponse.json(user);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id?: string } }) {
  const id = parseId(params.id);
  if (!id) return NextResponse.json({ error: 'invalid id' }, { status: 400 });
  try {
    const deleted = await prisma.user.delete({ where: { id } });
    return NextResponse.json(deleted);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
