import { useForm } from "@tanstack/react-form";
import { Button, Input } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { signInUser } from "../utils/api/auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useColorScheme } from "@mui/joy/styles";
import { Layers } from "lucide-react";
import type { AlertInterface } from "../misc/interfaces";
import { changeTranslation } from "../utils/uxFncs";
import { MyAlert } from "./MyAlert.tsx";

export const LoginCard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { mode, setMode } = useColorScheme();
  const search: { loggedOut?: boolean } = useSearch({ from: "/login" });
  const [alert, setAlert] = useState<AlertInterface>({
    isAlert: false,
    type: "neutral",
    header: "",
    text: "",
  });

  useEffect(() => {
    if (search.loggedOut) {
      setAlert({
        isAlert: true,
        type: "primary",
        header: t("success"),
        text: t("logout-success-text"),
      });
    }
    void navigate({ to: "/login" });
  }, []);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      mutate({ username: value.username, password: value.password });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => signInUser(username, password, t),
    onSuccess: (result) => {
      if (result.ok) {
        setAlert({
          isAlert: false,
          type: "neutral",
          header: "",
          text: "",
        });
        void navigate({ to: "/app/inventory" });
      }
    },
    onError: (error: unknown) => {
      const errorCode = (error as { code?: string })?.code;
      setAlert({
        isAlert: true,
        type: "danger",
        header: t("error"),
        text: errorCode ? t(errorCode) : t("unknown-error"),
      });
    },
  });

  return (
    <div className="flex min-h-screen w-full flex-col lg:flex-row">
      <div
        className="hidden flex-col justify-between px-12 py-10 lg:flex lg:w-1/2"
        style={{ backgroundColor: "#0e1116", color: "#e8ecf2" }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: "#5b8def" }}>
            <Layers size={16} color="white" />
          </span>
          <span className="text-lg font-bold">{t("app-title")}</span>
        </div>
        <div className="max-w-md space-y-3">
          <h2 className="text-3xl font-bold" style={{ letterSpacing: "-0.03em" }}>
            {t("login-tagline-1")}
          </h2>
          <p className="text-sm" style={{ color: "#8590a0" }}>
            {t("login-tagline-2")}
          </p>
        </div>
        <p className="text-xs" style={{ color: "#8590a0" }}>
          v0.9 MVP
        </p>
      </div>

      <div
        className="flex flex-1 items-center justify-center px-6 py-10"
        style={{ backgroundColor: "var(--joy-palette-background-body)" }}
      >
        <div className="w-full max-w-md space-y-6">
          <div className="flex items-center gap-2 lg:hidden">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-lg"
              style={{ backgroundColor: "var(--joy-palette-primary-solidBg)" }}
            >
              <Layers size={16} color="white" />
            </span>
            <span className="text-lg font-bold" style={{ color: "var(--joy-palette-text-primary)" }}>
              {t("app-title")}
            </span>
          </div>

          <div className="space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--joy-palette-primary-solidBg)" }}
            >
              {t("app-title")}
            </p>
            <h1 className="text-3xl font-bold" style={{ color: "var(--joy-palette-text-primary)" }}>
              {t("login")}
            </h1>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            {alert.isAlert && (
              <MyAlert type={alert.type} header={alert.header} text={alert.text} />
            )}
            <form.Field name="username">
              {(field) => (
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("username")}
                  variant="outlined"
                  size="lg"
                  className="rounded-2xl"
                />
              )}
            </form.Field>
            <form.Field name="password">
              {(field) => (
                <Input
                  value={field.state.value}
                  type="password"
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("password")}
                  variant="outlined"
                  size="lg"
                  className="rounded-2xl"
                />
              )}
            </form.Field>
            <Button
              type="submit"
              loading={isPending}
              size="lg"
              color="primary"
              variant="solid"
              className="btn-lift w-full rounded-2xl"
            >
              {t("login")}
            </Button>
          </form>

          <div
            className="flex items-center justify-center gap-3 text-sm"
            style={{ color: "var(--joy-palette-text-tertiary)" }}
          >
            <button type="button" onClick={changeTranslation} className="hover:underline">
              {i18n.language === "de" ? "English" : "Deutsch"}
            </button>
            <span>|</span>
            <button
              type="button"
              onClick={() => setMode(mode === "dark" ? "light" : "dark")}
              className="hover:underline"
            >
              {mode === "dark" ? t("theme-light") : t("theme-dark")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
