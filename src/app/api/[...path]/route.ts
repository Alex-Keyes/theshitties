import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import {
  adminAction,
  AppError,
  castVote,
  listNominees,
  rateLimit,
  reportNominee,
  submitNominee,
} from "@/lib/service";
import {
  clientKey,
  cookieOptions,
  isAdmin,
  passwordValid,
  sign,
  voterId,
} from "@/lib/auth";
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    const origin = req.headers.get("origin");
    if (
      !origin ||
      !/^https?:\/\//.test(origin) ||
      new URL(origin).host !== req.headers.get("host")
    )
      throw new AppError("Invalid request origin.", 403);
    if (Number(req.headers.get("content-length") || 0) > 20000)
      throw new AppError("Submission too large.", 413);
    const raw = await req.text();
    if (raw.length > 20000) throw new AppError("Submission too large.", 413);
    let body;
    try {
      body = JSON.parse(raw);
    } catch {
      throw new AppError("Invalid JSON.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body))
      throw new AppError("Invalid request.");
    const { path } = await params;
    const key = clientKey(
      req.headers.get("x-real-ip") ||
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "local",
    );
    if (path.join("/") === "session") {
      const voter = (await voterId()) || randomUUID();
      const res = NextResponse.json({ ok: true });
      res.cookies.set("shitties_voter", sign(voter), {
        ...cookieOptions,
        maxAge: 60 * 60 * 24 * 400,
      });
      return res;
    }
    if (path[0] === "admin") {
      if (path[1] === "login") {
        await rateLimit("login:" + key, 10, 900);
        if (
          typeof body.password !== "string" ||
          body.password.length > 200 ||
          !passwordValid(body.password)
        )
          throw new AppError(
            "Incorrect password or admin access is not configured.",
            401,
          );
        const res = NextResponse.json({ ok: true });
        res.cookies.set(
          "shitties_admin",
          sign("admin:" + (Date.now() + 8 * 3600000)),
          { ...cookieOptions, maxAge: 8 * 3600 },
        );
        return res;
      }
      if (!(await isAdmin()))
        throw new AppError("Sign in as administrator.", 401);
      if (path[1] === "logout") {
        const res = NextResponse.json({ ok: true });
        res.cookies.set("shitties_admin", "", { ...cookieOptions, maxAge: 0 });
        return res;
      }
      const adminSchema = z.discriminatedUnion("action", [
        z.object({ action: z.literal("resolve"), id: z.uuid() }),
        z.object({ action: z.literal("deadline"), date: z.iso.datetime() }),
        z.object({
          action: z.literal("moderate"),
          id: z.uuid(),
          status: z.enum(["visible", "hidden", "duplicate"]),
          duplicateOf: z.uuid().optional(),
        }),
      ]);
      const parsed = adminSchema.safeParse(body);
      if (!parsed.success) throw new AppError("Invalid admin request.");
      await adminAction(parsed.data);
      return NextResponse.json({ ok: true });
    }
    if (path[0] === "nominees" && path.length === 1) {
      await rateLimit("submit:" + key, 5, 3600);
      return NextResponse.json({ id: await submitNominee(body) });
    }
    if (path[0] === "nominees" && z.uuid().safeParse(path[1]).success) {
      if (path[2] === "vote") {
        if (typeof body.active !== "boolean")
          throw new AppError("Invalid vote.");
        await rateLimit("vote:" + key, 120, 60);
        const voter = (await voterId()) || randomUUID();
        const result = await castVote(path[1], voter, body.active);
        const res = NextResponse.json(result);
        res.cookies.set("shitties_voter", sign(voter), {
          ...cookieOptions,
          maxAge: 60 * 60 * 24 * 400,
        });
        return res;
      }
      if (path[2] === "report") {
        await rateLimit("report:" + key, 10, 3600);
        if (typeof body.reason !== "string")
          throw new AppError("Please give a reason.");
        await reportNominee(path[1], body.reason);
        return NextResponse.json({ ok: true });
      }
    }
    throw new AppError("Not found.", 404);
  } catch (e) {
    if (!(e instanceof AppError)) console.error(e);
    return NextResponse.json(
      {
        error:
          e instanceof AppError
            ? e.message
            : "Something went wrong. Please try again.",
      },
      { status: e instanceof AppError ? e.status : 500 },
    );
  }
}
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  if (path.join("/") !== "similar")
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  const q = (req.nextUrl.searchParams.get("q") || "")
    .trim()
    .slice(0, 100)
    .toLowerCase();
  if (q.length < 2) return NextResponse.json([]);
  const items = await listNominees();
  return NextResponse.json(
    items
      .filter((n) => n.company.toLowerCase().includes(q))
      .slice(0, 5)
      .map((n) => ({ id: n.id, company: n.company, headline: n.headline })),
  );
}
