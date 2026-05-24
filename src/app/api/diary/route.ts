import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getEntries, createEntry } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const entries = getEntries();
  return NextResponse.json(entries);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  const body = await req.json();
  const { title, content, mood } = body;

  if (!title) {
    return NextResponse.json({ error: "标题不能为空" }, { status: 400 });
  }

  const entry = createEntry({
    title,
    content: content || "",
    mood: mood || "",
  });

  return NextResponse.json(entry, { status: 201 });
}
