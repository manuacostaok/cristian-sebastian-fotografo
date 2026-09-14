"use client";

import { useState, useTransition } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetResults } from "next-cloudinary";
import { createPhotoFromUpload } from "@/app/admin/(dashboard)/portfolio/fotos/actions";

export function PhotoUploader() {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSuccess(results: CloudinaryUploadWidgetResults) {
    const info = results.info;
    if (!info || typeof info === "string") return;

    startTransition(async () => {
      try {
        await createPhotoFromUpload({
          url: info.secure_url,
          cloudinaryId: info.public_id,
          width: info.width,
          height: info.height,
        });
      } catch {
        setError("La foto se subió a Cloudinary pero no se pudo guardar en la base de datos.");
      }
    });
  }

  return (
    <div>
      <CldUploadWidget
        signatureEndpoint="/api/cloudinary/sign"
        options={{ folder: "christian-sebastian", multiple: true, sources: ["local", "url"] }}
        onSuccess={handleSuccess}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            disabled={pending}
            className="border border-ink bg-ink px-6 py-3 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink disabled:opacity-50"
          >
            {pending ? "Guardando…" : "Subir fotos"}
          </button>
        )}
      </CldUploadWidget>
      {error && <p className="mt-2 text-xs text-ember">{error}</p>}
    </div>
  );
}
