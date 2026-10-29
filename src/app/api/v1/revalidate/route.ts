import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { path, tag, secret } = await req.json();

    const expectedSecret = process.env.REVALIDATION_SECRET || "admission_secret_revalidate_2026";
    if (secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid revalidation secret" }, { status: 401 });
    }

    if (path) {
      revalidatePath(path);
      return NextResponse.json({ revalidated: true, path, now: Date.now() });
    }

    if (tag) {
      revalidateTag(tag);
      return NextResponse.json({ revalidated: true, tag, now: Date.now() });
    }

    return NextResponse.json({ error: "Missing path or tag parameter" }, { status: 400 });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }
}

