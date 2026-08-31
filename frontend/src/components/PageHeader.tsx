import type { ReactNode } from "react";
import { Typography } from "@mui/joy";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, actions }: PageHeaderProps) => (
  <div className="flex flex-wrap items-start justify-between gap-4">
    <div className="space-y-1">
      <Typography level="h2" sx={{ color: "var(--joy-palette-text-primary)" }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography level="body-lg" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
          {subtitle}
        </Typography>
      )}
    </div>
    {actions && <div className="flex items-center gap-3">{actions}</div>}
  </div>
);
