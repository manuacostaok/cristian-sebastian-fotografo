import Link from "next/link";
import { PageHeader, Table, Th, Td, EmptyState } from "@/components/admin/Page";
import { LeadStatusSelect } from "@/components/admin/LeadStatusSelect";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { formatDateShort } from "@/lib/utils";

const SOURCE_LABELS: Record<string, string> = {
  INSTAGRAM: "Instagram",
  GOOGLE: "Google",
  WHATSAPP: "WhatsApp",
  WEB: "Web",
  DIRECT: "Directo",
};

export default async function LeadsPage() {
  const leads = await safeQuery(
    () => prisma.lead.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );

  return (
    <div>
      <PageHeader title="Leads" description="Consultas recibidas desde la web." />

      {leads.length === 0 ? (
        <EmptyState message="Todavía no hay consultas registradas." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Nombre</Th>
              <Th>Contacto</Th>
              <Th>Evento</Th>
              <Th>Fecha evento</Th>
              <Th>Origen</Th>
              <Th>Estado</Th>
              <Th>Recibido</Th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id}>
                <Td className="font-medium">
                  <Link href={`/admin/leads/${lead.id}`} className="hover:underline">
                    {lead.name}
                  </Link>
                </Td>
                <Td>
                  <div className="flex flex-col">
                    <span>{lead.phone}</span>
                    {lead.email && <span className="text-xs text-paper-muted">{lead.email}</span>}
                  </div>
                </Td>
                <Td>
                  <div className="flex flex-col">
                    <span>{lead.eventType}</span>
                    {lead.location && <span className="text-xs text-paper-muted">{lead.location}</span>}
                  </div>
                </Td>
                <Td>{lead.eventDate ? formatDateShort(lead.eventDate) : "—"}</Td>
                <Td>{SOURCE_LABELS[lead.source] ?? lead.source}</Td>
                <Td>
                  <LeadStatusSelect id={lead.id} status={lead.status} />
                </Td>
                <Td className="text-xs text-paper-muted">{formatDateShort(lead.createdAt)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
