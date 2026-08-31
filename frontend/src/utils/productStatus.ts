const EXPIRING_SOON_DAYS = 90;
const LOW_STOCK_MAX = 2;

const daysUntil = (value?: string | null) => {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return null;
  }
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return Math.round((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const isExpired = (expiryDate?: string | null) => {
  const days = daysUntil(expiryDate);
  return days !== null && days < 0;
};

export const isExpiringSoon = (expiryDate?: string | null) => {
  const days = daysUntil(expiryDate);
  return days !== null && days >= 0 && days <= EXPIRING_SOON_DAYS;
};

export const isLowStock = (amount: number) => amount > 0 && amount <= LOW_STOCK_MAX;

export type ProductStatus = "expired" | "expiring-soon" | "ok";

export const getProductStatus = (expiryDate?: string | null): ProductStatus => {
  if (isExpired(expiryDate)) {
    return "expired";
  }
  if (isExpiringSoon(expiryDate)) {
    return "expiring-soon";
  }
  return "ok";
};

// Days remaining until expiry (negative = days since it expired), plus the
// derived status. Components format this into copy via i18next (t()) so the
// wording stays translatable.
export const getExpiryDays = (
  expiryDate?: string | null,
): { days: number; status: ProductStatus } | null => {
  const days = daysUntil(expiryDate);
  if (days === null) {
    return null;
  }
  return { days, status: getProductStatus(expiryDate) };
};
