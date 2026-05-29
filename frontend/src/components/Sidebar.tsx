import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/joy";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddBoxIcon from "@mui/icons-material/AddBox";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { useNavigate, useMatchRoute } from "@tanstack/react-router";
import Cookies from "js-cookie";

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
          {Cookies.get("app-name") ? Cookies.get("app-name") : ""}
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
          onClick={() => navigate({ to: "/app/storages" })}
          variant={variant("/app/storages")}
          startDecorator={<StorageIcon />}
          className={btnClass}
        >
          {t("storages")}
        </Button>
        <Button
          onClick={() => navigate({ to: "/app/app-settings" })}
          variant={variant("/app/app-settings")}
          startDecorator={<SettingsIcon />}
          className={btnClass}
        >
          {t("settings")}
        </Button>
        <Button
          onClick={() => {
            Cookies.remove("token");
            navigate({ to: "/login" });
          }}
          variant={variant("/login")}
          startDecorator={<ExitToAppIcon />}
          className={btnClass}
        >
          {t("logout")}
        </Button>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#0b6bcb] shadow-[0_12px_30px_rgba(12,38,78,0.12)]">
        <img
          src="/favicon.png"
          alt="Stockhome"
          className="h-7 w-7 rounded-lg"
        />
        <span>Stockhome</span>
      </div>
    </aside>
  );
};
