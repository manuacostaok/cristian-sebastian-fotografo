"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/home", label: "Home" },
  { href: "/admin/portfolio/categorias", label: "Categorías" },
  { href: "/admin/portfolio/fotos", label: "Fotos" },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/eventos", label: "Eventos" },
  { href: "/admin/disponibilidad", label: "Disponibilidad" },
  { href: "/admin/galerias", label: "Galerías privadas" },
  { href: "/admin/servicios", label: "Servicios" },
  { href: "/admin/precios", label: "Precios / Extras" },
  { href: "/admin/presupuestos", label: "Presupuestos" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/clientes", label: "Clientes" },
  { href: "/admin/testimonios", label: "Testimonios" },
  { href: "/admin/journal", label: "Journal" },
  { href: "/admin/zonas", label: "Zonas de trabajo" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/configuracion", label: "Configuración" },
];

export function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-paper-line bg-paper-dim">
      <div className="p-6">
        <p className="font-display text-lg">Christian Sebastián</p>
        <p className="text-[11px] uppercase tracking-[0.14em] text-paper-muted">Admin</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3">
        {NAV.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-sm px-3 py-2 text-sm transition-colors",
                active ? "bg-ink text-paper" : "text-ink/80 hover:bg-paper",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-paper-line p-4">
        <p className="truncate px-3 text-xs text-paper-muted">{userName}</p>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-2 w-full rounded-sm px-3 py-2 text-left text-sm text-paper-muted hover:bg-paper"
        >
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
