import { NextRequest, NextResponse } from "next/server";
import { getSession, login } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password || typeof password !== "string") {
    return NextResponse.json({ error: "密码不能为空" }, { status: 400 });
  }

  const valid = await login(password);
  if (!valid) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  const session = await getSession();
  session.isLoggedIn = true;
  await session.save();

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const session = await getSession();
  session.destroy();
  return NextResponse.json({ ok: true });
}
