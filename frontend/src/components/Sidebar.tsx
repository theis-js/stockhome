import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Typography } from "@mui/joy";
import InventoryIcon from "@mui/icons-material/Inventory";
import AddBoxIcon from "@mui/icons-material/AddBox";
import StorageIcon from "@mui/icons-material/Storage";
import SettingsIcon from "@mui/icons-material/Settings";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import TranslateIcon from "@mui/icons-material/Translate";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useMatchRoute, useNavigate } from "@tanstack/react-router";
import Cookies from "js-cookie";
import { changeTranslation } from "../utils/uxFncs";

export const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const matchRoute = useMatchRoute();
  const [isOpen, setIsOpen] = useState(false);

  const btnClass =
    "h-11 w-full justify-start! rounded-2xl px-4 text-left text-sm font-semibold text-slate-700 transition hover:bg-white/80 hover:text-[#0b6bcb] [&_.MuiButton-startDecorator]:mr-3! [&_.MuiButton-startDecorator]:ml-0!";

  const variant = (to: string) =>
    !!matchRoute({ to, fuzzy: false }) ? "soft" : "plain";

  const handleNavigate = (to: string) => {
    navigate({ to });
    setIsOpen(false);
  };

  return (
    <aside className="flex w-full flex-col gap-6 border-b border-white/80 bg-linear-to-b from-[#f7fbff] via-[#f2f6fb] to-[#eef3f9] px-4 py-5 shadow-[0_20px_60px_rgba(11,107,203,0.08)] sm:px-5 lg:h-full lg:min-h-screen lg:max-w-70 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
      <div className="flex items-center justify-between gap-4">
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
        <Button
          variant="soft"
          size="sm"
          className="transition-transform duration-200 ease-out"
          onClick={() => setIsOpen((open) => !open)}
          startDecorator={
            <span
              className={`inline-flex transition-transform duration-200 ease-out ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            >
              {isOpen ? <CloseIcon /> : <MenuIcon />}
            </span>
          }
          sx={{
            display: "inline-flex",
            "@media (min-width: 1024px)": { display: "none" },
          }}
        >
          {isOpen ? t("close") : t("menu")}
        </Button>
      </div>

      <div
        className={`flex flex-1 flex-col gap-8 overflow-hidden transition-all duration-200 ease-out lg:overflow-visible lg:transition-none ${
          isOpen
            ? "max-h-120 opacity-100 pointer-events-auto"
            : "max-h-0 opacity-0 pointer-events-none"
        } lg:max-h-none lg:opacity-100 lg:pointer-events-auto`}
      >
        <div className="flex flex-1 flex-col gap-2">
          <Button
            onClick={() => handleNavigate("/app/inventory")}
            variant={variant("/app/inventory")}
            startDecorator={<InventoryIcon />}
            className={btnClass}
          >
            {t("inventory")}
          </Button>
          <Button
            onClick={() => handleNavigate("/app/add-product")}
            variant={variant("/app/add-product")}
            startDecorator={<AddBoxIcon />}
            className={btnClass}
          >
            {t("add")}
          </Button>
          <Button
            onClick={() => handleNavigate("/app/storages")}
            variant={variant("/app/storages")}
            startDecorator={<StorageIcon />}
            className={btnClass}
          >
            {t("storages")}
          </Button>
          <Button
            onClick={() => handleNavigate("/app/app-settings")}
            variant={variant("/app/app-settings")}
            startDecorator={<SettingsIcon />}
            className={btnClass}
          >
            {t("settings")}
          </Button>
          <Button
            onClick={() => {
              Cookies.remove("token");
              handleNavigate("/login?logout=true");
            }}
            color="danger"
            startDecorator={<ExitToAppIcon />}
            className={btnClass}
          >
            {t("logout")}
          </Button>
          <Button
            onClick={() => {
              changeTranslation();
              setIsOpen(false);
            }}
            color="neutral"
            startDecorator={<TranslateIcon />}
            className={btnClass}
          >
            {t("change-translation")}
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
      </div>
    </aside>
  );
};
