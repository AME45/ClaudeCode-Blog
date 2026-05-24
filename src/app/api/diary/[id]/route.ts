import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEntry, updateEntry, deleteEntry } from "@/lib/db";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const entry = getEntry(Number(id));
  if (!entry) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { title, content, mood } = body;

  if (!title) {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }

  const entry = updateEntry(Number(id), {
    title,
    content: content || "",
    mood: mood || "",
  });

  if (!entry) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  return NextResponse.json(entry);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const { id } = await params;
  const deleted = deleteEntry(Number(id));
  if (!deleted) {
    return NextResponse.json({ error: "未找到" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
