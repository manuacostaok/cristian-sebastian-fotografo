import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

const INK = "#14110f";
const GOLD = "#c9a15a";
const PAPER = "#f7f3ee";
const MUTED = "#6b6259";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    color: INK,
    fontFamily: "Helvetica",
    backgroundColor: PAPER,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: INK,
    paddingBottom: 16,
    marginBottom: 24,
  },
  brand: {
    fontFamily: "Helvetica-Bold",
    fontSize: 18,
    letterSpacing: 0.5,
  },
  brandSub: {
    fontSize: 9,
    color: MUTED,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  docLabel: {
    fontSize: 9,
    color: GOLD,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    textAlign: "right",
  },
  docDate: {
    fontSize: 9,
    color: MUTED,
    marginTop: 2,
    textAlign: "right",
  },
  section: { marginBottom: 20 },
  sectionLabel: {
    fontSize: 8,
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
  },
  row: { flexDirection: "row", justifyContent: "space-between" },
  grid2: { flexDirection: "row", gap: 32 },
  col: { flex: 1 },
  label: { fontSize: 9, color: MUTED },
  value: { fontSize: 11, marginTop: 2 },
  table: { marginTop: 8, borderTopWidth: 1, borderTopColor: "#d8d0c3" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d8d0c3",
  },
  tableItem: { fontSize: 10 },
  tableTotal: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
  },
  totalLabel: { fontFamily: "Helvetica-Bold", fontSize: 13 },
  totalValue: { fontFamily: "Helvetica-Bold", fontSize: 13 },
  conditions: { marginTop: 32, fontSize: 8.5, color: MUTED, lineHeight: 1.5 },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 48,
    right: 48,
    fontSize: 8,
    color: MUTED,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#d8d0c3",
    paddingTop: 10,
  },
});

function formatARS(value: number) {
  return new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(
    value,
  );
}

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" }).format(
    date,
  );
}

export type QuotePdfData = {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string | null;
  eventType?: string | null;
  eventDate?: Date | null;
  location?: string | null;
  items: { name: string; price: number }[];
  total: number;
  validUntil: Date | null;
  createdAt: Date;
  whatsappNumber?: string;
};

export function QuoteDocument({ data }: { data: QuotePdfData }) {
  return (
    <Document title={`Presupuesto — ${data.clientName}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Christian Sebastián</Text>
            <Text style={styles.brandSub}>Fotógrafo — Buenos Aires</Text>
          </View>
          <View>
            <Text style={styles.docLabel}>Presupuesto</Text>
            <Text style={styles.docDate}>{formatDate(data.createdAt)}</Text>
            <Text style={styles.docDate}>N.º {data.id.slice(-8).toUpperCase()}</Text>
          </View>
        </View>

        <View style={[styles.section, styles.grid2]}>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Cliente</Text>
            <Text style={styles.value}>{data.clientName}</Text>
            <Text style={styles.label}>{data.clientPhone}</Text>
            {data.clientEmail && <Text style={styles.label}>{data.clientEmail}</Text>}
          </View>
          <View style={styles.col}>
            <Text style={styles.sectionLabel}>Evento</Text>
            <Text style={styles.value}>{data.eventType ?? "—"}</Text>
            <Text style={styles.label}>
              {formatDate(data.eventDate ?? null)}
              {data.location ? ` — ${data.location}` : ""}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Detalle</Text>
          <View style={styles.table}>
            {data.items.map((item, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.tableItem}>{item.name}</Text>
                <Text style={styles.tableItem}>{formatARS(item.price)}</Text>
              </View>
            ))}
          </View>
          <View style={styles.tableTotal}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatARS(data.total)}</Text>
          </View>
        </View>

        <View style={styles.conditions}>
          <Text>
            Validez de este presupuesto: {formatDate(data.validUntil)}. La reserva de la fecha se
            confirma con seña. Forma de pago y condiciones a coordinar por WhatsApp.
          </Text>
        </View>

        <View style={styles.footer} fixed>
          <Text>
            Christian Sebastián — Fotógrafo · Buenos Aires, Argentina
            {data.whatsappNumber ? ` · WhatsApp +${data.whatsappNumber}` : ""}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
