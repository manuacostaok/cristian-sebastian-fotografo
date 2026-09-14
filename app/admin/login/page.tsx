"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });

    setLoading(false);
    if (res?.error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    router.push(searchParams.get("callbackUrl") ?? "/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-6 text-paper">
      <div className="w-full max-w-sm">
        <p className="font-display text-2xl">Christian Sebastián</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-ink-muted">Panel administrativo</p>

        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">Email</span>
            <input
              name="email"
              type="email"
              required
              className="border border-ink-line bg-transparent px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[11px] uppercase tracking-[0.14em] text-ink-muted">Contraseña</span>
            <input
              name="password"
              type="password"
              required
              className="border border-ink-line bg-transparent px-4 py-3 text-sm focus:border-gold focus:outline-none"
            />
          </label>

          {error && <p className="text-sm text-ember">{error}</p>}

          <Button type="submit" variant="solid" className="mt-2 bg-paper text-ink hover:bg-gold">
            {loading ? "Ingresando…" : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  );
}
