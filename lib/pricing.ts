export type PricedItem = {
  id: string;
  name: string;
  price: number;
};

export type QuoteResult = {
  requiresCustomQuote: boolean;
  items: PricedItem[];
  total: number;
};

/**
 * Computes a wizard estimate from a chosen service + extras.
 * If the service (or any selected extra) is flagged custom-quote-only,
 * no total is computed — the flow should route to "solicitar presupuesto".
 */
export function computeQuote(
  service: { id: string; name: string; basePrice: number; requiresCustomQuote: boolean },
  extras: { id: string; name: string; price: number }[],
): QuoteResult {
  if (service.requiresCustomQuote) {
    return { requiresCustomQuote: true, items: [], total: 0 };
  }

  const items: PricedItem[] = [
    { id: service.id, name: service.name, price: service.basePrice },
    ...extras.map((e) => ({ id: e.id, name: e.name, price: e.price })),
  ];

  return {
    requiresCustomQuote: false,
    items,
    total: items.reduce((sum, item) => sum + item.price, 0),
  };
}
