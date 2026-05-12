export function formatPrice(
  value?: number | null,
  currency: string = 'CAD',
  locale: string = 'en-CA'
) {
  if (value == null) return null;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `$ ${Number(value).toFixed(2)}`;
  }
}
