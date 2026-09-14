"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

const NAV_LINKS = [
  { href: "/portfolio", label: "Portfolio" },
  { href: "/disponibilidad", label: "Disponibilidad" },
  { href: "/presupuesto", label: "Presupuesto" },
  { href: "/journal", label: "Journal" },
  { href: "/sobre-mi", label: "Sobre mí" },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-colors duration-500 ease-[var(--ease-editorial)]",
        solid ? "bg-paper/95 text-ink backdrop-blur-sm border-b border-paper-line" : "bg-transparent text-paper",
      )}
    >
      <Container wide>
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg tracking-wide"
            aria-label="Christian Sebastián — inicio"
          >
            Christian Sebastián
          </Link>

          <nav className="hidden items-center gap-9 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-[11px] uppercase tracking-[0.16em] transition-opacity hover:opacity-60",
                  pathname === link.href && "opacity-50",
                )}
              >
                {link.label}
              </Link>
            ))}
            <ButtonLink href="/consultar" size="sm" variant={solid ? "solid" : "outline"}>
              Consultar fecha
            </ButtonLink>
          </nav>

          <button
            className="p-2 lg:hidden"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-paper-line bg-paper text-ink lg:hidden">
          <Container>
            <nav className="flex flex-col gap-1 py-6">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-sm uppercase tracking-[0.14em]"
                >
                  {link.label}
                </Link>
              ))}
              <ButtonLink href="/consultar" className="mt-4 w-fit">
                Consultar fecha
              </ButtonLink>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
