import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { AppError, rateLimit, season } from "@/lib/service";
import { clientKey } from "@/lib/auth";

const maxImageBytes = 5 * 1024 * 1024;
const allowedContentTypes = ["image/jpeg", "image/png", "image/webp"];

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return (
    !!origin &&
    /^https?:\/\//.test(origin) &&
    new URL(origin).host === new URL(request.url).host
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as HandleUploadBody;
    const key = clientKey(
      request.headers.get("x-real-ip") ||
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "local",
    );
    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!sameOrigin(request))
          throw new AppError("Invalid request origin.", 403);
        await rateLimit("image-upload:" + key, 15, 3600);
        const current = await season();
        if (new Date(current.closesAt).getTime() <= Date.now())
          throw new AppError("This year’s nominations have closed.");
        if (!/^nominations\/[0-9a-f-]{36}\.(?:jpe?g|png|webp)$/i.test(pathname))
          throw new AppError("Invalid image upload path.");
        return {
          allowedContentTypes,
          maximumSizeInBytes: maxImageBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ key }),
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return NextResponse.json(response);
  } catch (error) {
    if (!(error instanceof AppError)) console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof AppError
            ? error.message
            : "Could not prepare the image upload.",
      },
      { status: error instanceof AppError ? error.status : 400 },
    );
  }
}
