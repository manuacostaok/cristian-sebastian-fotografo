import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

/**
 * Signs an upload request so the admin panel can upload directly to
 * Cloudinary. Contract expected by next-cloudinary's CldUploadWidget
 * `signatureEndpoint`: POST { paramsToSign } -> { signature }.
 */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { paramsToSign } = await request.json().catch(() => ({ paramsToSign: {} }));

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!,
  );

  return NextResponse.json({ signature });
}
