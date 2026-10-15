export const pricing = {
  oneForAll: null as number | null,
  custom: null as number | null,
};

export function priceLabel(value: number | null) {
  return value === null ? "Get a quote" : `Starting from $${value.toLocaleString("en-US")}`;
}
