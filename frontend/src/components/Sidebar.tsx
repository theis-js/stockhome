import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/joy";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import { useNavigate, useMatchRoute } from "@tanstack/react-router";

export const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();

  const btnClass =
    "h-11 w-full justify-start! rounded-2xl px-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-white/80 hover:text-[#0b6bcb] [&_.MuiButton-startDecorator]:mr-3! [&_.MuiButton-startDecorator]:ml-0!";

  const variant = (to: string) =>
    !!matchRoute({ to, fuzzy: false }) ? "soft" : "plain";

  return (
    <aside className="flex h-full min-h-screen w-full max-w-70 flex-col gap-8 border-r border-white/80 bg-linear-to-b from-[#f7fbff] via-[#f2f6fb] to-[#eef3f9] px-6 py-8 shadow-[0_20px_60px_rgba(11,107,203,0.08)]">
      <div className="space-y-2">
        <Typography
          level="h2"
          className="text-[22px] font-semibold text-[#0b6bcb]"
        >
          {t("app-title")}
        </Typography>
        <Typography
          level="body-lg"
          className="text-sm font-medium text-slate-500"
        >
          {t("app-subtitle")}
        </Typography>
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <Button
          onClick={() => navigate({ to: "/app/inventory" })}
          variant={variant("/app/inventory")}
          startDecorator={<InventoryIcon />}
          className={btnClass}
        >
          {t("inventory")}
        </Button>
        <Button
          onClick={() => navigate({ to: "/app/add-product" })}
          variant={variant("/app/add-product")}
          startDecorator={<AddBoxIcon />}
          className={btnClass}
        >
          {t("add")}
        </Button>
        <Button
          onClick={() => navigate({ to: "/app/profile" })}
          variant={variant("/app/profile")}
          startDecorator={<AccountBoxIcon />}
          className={btnClass}
        >
          {t("profile")}
        </Button>
      </div>

      <div className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b6bcb] shadow-[0_12px_30px_rgba(12,38,78,0.12)]">
        Stockhome
      </div>
    </aside>
  );
};
