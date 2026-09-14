import Link from "next/link";
import { Container } from "@/components/ui/Container";

const COLUMNS = [
  {
    title: "Explorar",
    links: [
      { href: "/portfolio", label: "Portfolio" },
      { href: "/journal", label: "Journal" },
      { href: "/sobre-mi", label: "Sobre mí" },
    ],
  },
  {
    title: "Trabajemos juntos",
    links: [
      { href: "/disponibilidad", label: "Disponibilidad" },
      { href: "/presupuesto", label: "Presupuesto" },
      { href: "/consultar", label: "Consultar fecha" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-32 bg-ink text-paper">
      <Container wide className="py-20">
        <div className="grid gap-16 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl">Christian Sebastián</p>
            <p className="mt-4 max-w-xs text-sm text-ink-muted">
              Fotógrafo en Buenos Aires. Historias que merecen ser recordadas.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink-muted">
                {col.title}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-opacity hover:opacity-60"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink-line pt-8 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Christian Sebastián. Todos los derechos reservados.</p>
          <p>Buenos Aires, Argentina</p>
        </div>
      </Container>
    </footer>
  );
}
