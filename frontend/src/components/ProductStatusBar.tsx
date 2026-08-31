import { Chip } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { getExpiryDays, type ProductStatus } from "../utils/productStatus";

const accentColor: Record<ProductStatus, string> = {
  expired: "var(--joy-palette-danger-solidBg)",
  "expiring-soon": "var(--joy-palette-warning-solidBg)",
  ok: "transparent",
};

// Colored left-edge bar used on Inventory rows/cards to flag expiry status.
export const ProductStatusBar = ({ status }: { status: ProductStatus }) => (
  <span
    className="block h-full w-[3px] shrink-0 self-stretch rounded-full"
    style={{ backgroundColor: accentColor[status] }}
  />
);

const chipColor: Record<ProductStatus, "danger" | "warning" | "neutral"> = {
  expired: "danger",
  "expiring-soon": "warning",
  ok: "neutral",
};

// "Expires in N days" / "Expired N days ago" chip used on product detail headers.
export const ExpiryBadge = ({ expiryDate }: { expiryDate?: string | null }) => {
  const { t } = useTranslation();
  const expiry = getExpiryDays(expiryDate);
  if (!expiry) {
    return null;
  }

  const text =
    expiry.status === "expired"
      ? t("days-since-expired", { count: Math.abs(expiry.days) })
      : t("expires-in-days-badge", { count: expiry.days });

  return (
    <Chip variant="soft" color={chipColor[expiry.status]} size="sm" className="rounded-full px-3">
      {text}
    </Chip>
  );
};
