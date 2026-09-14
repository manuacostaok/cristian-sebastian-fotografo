import { PageHeader, Table, Th, Td, EmptyState } from "@/components/admin/Page";
import { QuoteStatusSelect } from "@/components/admin/QuoteStatusSelect";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { formatCurrencyARS, formatDateShort } from "@/lib/utils";

export default async function PresupuestosPage() {
  const quotes = await safeQuery(
    () =>
      prisma.quote.findMany({
        orderBy: { createdAt: "desc" },
        include: { lead: true, client: true },
      }),
    [],
  );

  return (
    <div>
      <PageHeader title="Presupuestos" description="Estimaciones generadas desde el wizard público." />

      {quotes.length === 0 ? (
        <EmptyState message="Todavía no se generaron presupuestos." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Contacto</Th>
              <Th>Items</Th>
              <Th>Total</Th>
              <Th>Estado</Th>
              <Th>Fecha</Th>
              <Th>{" "}</Th>
            </tr>
          </thead>
          <tbody>
            {quotes.map((quote) => {
              const items = Array.isArray(quote.items) ? (quote.items as { name: string }[]) : [];
              return (
                <tr key={quote.id}>
                  <Td>{quote.lead?.name ?? quote.client?.name ?? "—"}</Td>
                  <Td className="text-xs text-paper-muted">{items.map((i) => i.name).join(", ")}</Td>
                  <Td>{formatCurrencyARS(Number(quote.total))}</Td>
                  <Td>
                    <QuoteStatusSelect id={quote.id} status={quote.status} />
                  </Td>
                  <Td className="text-xs text-paper-muted">{formatDateShort(quote.createdAt)}</Td>
                  <Td>
                    <a
                      href={`/api/quotes/${quote.id}/pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-[0.08em] underline"
                    >
                      PDF
                    </a>
                  </Td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </div>
  );
}
