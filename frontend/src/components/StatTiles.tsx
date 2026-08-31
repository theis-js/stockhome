import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

interface StatTilesProps {
  expired: number;
  expiringSoon: number;
  lowStock: number;
  unitsStored: number;
}

export const StatTiles = ({
  expired,
  expiringSoon,
  lowStock,
  unitsStored,
}: StatTilesProps) => {
  const { t } = useTranslation();

  const tiles = [
    { value: expired, label: t("stat-expired"), accent: "var(--joy-palette-danger-solidBg)" },
    { value: expiringSoon, label: t("stat-expiring-soon"), accent: "var(--joy-palette-warning-solidBg)" },
    { value: lowStock, label: t("stat-low-stock"), accent: "var(--joy-palette-neutral-500)" },
    { value: unitsStored, label: t("stat-units-stored"), accent: "var(--joy-palette-primary-solidBg)" },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="flex items-center gap-3 rounded-2xl border border-solid px-4 py-4"
          style={{
            borderColor: "var(--joy-palette-divider)",
            backgroundColor: "var(--joy-palette-background-surface)",
          }}
        >
          <span
            className="h-9 w-[3px] shrink-0 rounded-full"
            style={{ backgroundColor: tile.accent }}
          />
          <div>
            <Typography level="h2" sx={{ color: "var(--joy-palette-text-primary)" }}>
              {tile.value}
            </Typography>
            <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
              {tile.label}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
};
