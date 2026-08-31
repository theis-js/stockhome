import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Chip, Typography } from "@mui/joy";
import { Package, Plus, Layers, Settings, Menu, X, ChevronRight } from "lucide-react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getProducts } from "../utils/api/products.ts";
import { getStorages } from "../utils/api/storages.ts";

export const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [isOpen, setIsOpen] = useState(false);

  const { data: products } = useQuery({ queryKey: ["products"], queryFn: getProducts });
  const { data: storages } = useQuery({ queryKey: ["storages"], queryFn: getStorages });

  const btnClass =
    "h-11 w-full justify-start! rounded-2xl px-4 text-left text-sm font-semibold transition-colors duration-150 [&_.MuiButton-startDecorator]:mr-3! [&_.MuiButton-startDecorator]:ml-0! [&_.MuiButton-endDecorator]:ml-auto!";

  const isActive = (to: string) => pathname === to || pathname.startsWith(`${to}/`);

  const handleNavigate = (to: string) => {
    void navigate({ to });
    setIsOpen(false);
  };

  const appName = Cookies.get("app-name") || t("app-title");
  const initials = appName.slice(0, 2).toUpperCase();

  const navItems = [
    { to: "/app/inventory", label: t("inventory"), icon: <Package size={18} />, count: products?.length },
    { to: "/app/add-product", label: t("add"), icon: <Plus size={18} /> },
    { to: "/app/storages", label: t("storages"), icon: <Layers size={18} />, count: storages?.length },
    { to: "/app/app-settings", label: t("settings"), icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className="flex w-full flex-col gap-6 px-4 py-5 sm:px-5 lg:h-full lg:min-h-screen lg:max-w-70 lg:border-b-0 lg:border-r lg:px-6 lg:py-8"
      style={{
        borderBottom: "1px solid var(--joy-palette-divider)",
        borderRightColor: "var(--joy-palette-divider)",
        backgroundColor: "var(--joy-palette-background-surface)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: "var(--joy-palette-primary-solidBg)" }}
          >
            <Layers size={16} color="white" />
          </span>
          <Typography
            level="title-lg"
            className="text-[17px] font-bold"
            sx={{ color: "var(--joy-palette-text-primary)" }}
          >
            {t("app-title")}
          </Typography>
        </div>
        <Button
          variant="soft"
          color="neutral"
          size="sm"
          sx={{
            display: "inline-flex",
            "@media (min-width: 1024px)": { display: "none" },
          }}
          onClick={() => setIsOpen((open) => !open)}
          startDecorator={isOpen ? <X size={16} /> : <Menu size={16} />}
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
        <div className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = isActive(item.to);
            return (
              <Button
                key={item.to}
                onClick={() => handleNavigate(item.to)}
                variant={active ? "soft" : "plain"}
                color="primary"
                startDecorator={item.icon}
                endDecorator={
                  item.count !== undefined ? (
                    <Chip size="sm" variant="soft" color={active ? "primary" : "neutral"}>
                      {item.count}
                    </Chip>
                  ) : undefined
                }
                className={btnClass}
                sx={{
                  color: active
                    ? "var(--joy-palette-primary-solidBg)"
                    : "var(--joy-palette-text-secondary)",
                  borderLeft: "3px solid",
                  borderLeftColor: active ? "var(--joy-palette-primary-solidBg)" : "transparent",
                  "&:hover": {
                    bgcolor: active
                      ? "var(--joy-palette-primary-softBg)"
                      : "var(--joy-palette-background-level1)",
                  },
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => handleNavigate("/app/app-settings")}
          className="flex items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition"
          style={{
            border: "1px solid var(--joy-palette-divider)",
            backgroundColor: "var(--joy-palette-background-level1)",
          }}
        >
          <span
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold"
            style={{
              backgroundColor: "var(--joy-palette-primary-softBg)",
              color: "var(--joy-palette-primary-softColor)",
            }}
          >
            {initials}
          </span>
          <div className="min-w-0 flex-1">
            <Typography level="title-md" className="truncate" sx={{ color: "var(--joy-palette-text-primary)" }}>
              {appName}
            </Typography>
          </div>
          <ChevronRight size={16} color="var(--joy-palette-text-tertiary)" />
        </button>
      </div>
    </aside>
  );
};
