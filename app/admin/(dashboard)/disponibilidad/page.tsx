import { PageHeader, Table, Th, Td, Card, EmptyState } from "@/components/admin/Page";
import { prisma } from "@/lib/prisma";
import { safeQuery } from "@/lib/safe-query";
import { formatDateLong } from "@/lib/utils";
import { setAvailability, deleteAvailability } from "./actions";

const STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponible",
  CONSULT: "Consultar",
  BUSY: "Ocupado",
};

export default async function DisponibilidadAdminPage() {
  const overrides = await safeQuery(
    () =>
      prisma.availabilityDay.findMany({
        where: { date: { gte: new Date(new Date().toDateString()) } },
        orderBy: { date: "asc" },
      }),
    [],
  );

  return (
    <div>
      <PageHeader
        title="Disponibilidad"
        description="El calendario público nunca muestra el nombre del cliente o evento — solo el estado."
      />

      <Card className="mb-10">
        <form action={setAvailability} className="flex flex-wrap items-end gap-4">
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Fecha</span>
            <input name="date" type="date" required className="field w-44" />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Estado</span>
            <select name="status" defaultValue="BUSY" className="field w-40">
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 flex-1 min-w-[200px]">
            <span className="text-[11px] uppercase tracking-[0.1em] text-paper-muted">Nota interna (privada)</span>
            <input name="internalNote" className="field" placeholder="Ej: Boda de Juan y María" />
          </label>
          <button type="submit" className="border border-ink bg-ink px-4 py-2 text-xs uppercase tracking-[0.1em] text-paper hover:bg-gold hover:text-ink">
            Guardar día
          </button>
        </form>
      </Card>

      {overrides.length === 0 ? (
        <EmptyState message="No hay excepciones cargadas — todos los días futuros se muestran como disponibles." />
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Estado</Th>
              <Th>Nota interna</Th>
              <Th>{" "}</Th>
            </tr>
          </thead>
          <tbody>
            {overrides.map((day) => (
              <tr key={day.id}>
                <Td>{formatDateLong(day.date)}</Td>
                <Td>{STATUS_LABELS[day.status]}</Td>
                <Td className="text-paper-muted">{day.internalNote ?? "—"}</Td>
                <Td>
                  <form action={deleteAvailability}>
                    <input type="hidden" name="id" value={day.id} />
                    <button type="submit" className="text-xs text-ember hover:underline">Quitar</button>
                  </form>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
