import { useForm } from "@tanstack/react-form";
import { Button, Input } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { signInUser } from "../utils/api/auth";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { AlertInterface } from "../misc/interfaces";
import { MyAlert } from "./MyAlert.tsx";

export const LoginCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
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
    <div
      className="flex min-h-screen w-full items-center justify-center px-6 py-10"
      style={{
        background:
          "radial-gradient(1200px circle at 20% 10%, var(--joy-palette-primary-100) 0%, var(--joy-palette-background-body) 40%, var(--joy-palette-background-level1) 100%)",
      }}
    >
      <div className="mx-auto flex w-full max-w-4xl items-center justify-center">
        <div
          className="w-full max-w-md rounded-3xl p-8 backdrop-blur"
          style={{
            border: "1px solid var(--joy-palette-divider)",
            backgroundColor: "var(--joy-palette-background-surface)",
            boxShadow:
              "0 24px 60px color-mix(in srgb, var(--joy-palette-primary-800) 18%, transparent)",
          }}
        >
          <div className="mb-8 space-y-2">
            <p
              className="text-xs font-semibold uppercase tracking-[0.3em]"
              style={{ color: "var(--joy-palette-primary-solidBg)" }}
            >
              Stockhome
            </p>
            <h1
              className="text-3xl font-semibold"
              style={{ color: "var(--joy-palette-text-primary)" }}
            >
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
              <MyAlert
                type={alert.type}
                header={alert.header}
                text={alert.text}
              />
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
                  sx={{
                    bgcolor: "var(--joy-palette-background-surface)",
                    boxShadow: "0 10px 24px var(--joy-palette-divider)",
                  }}
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
                  sx={{
                    bgcolor: "var(--joy-palette-background-surface)",
                    boxShadow: "0 10px 24px var(--joy-palette-divider)",
                  }}
                />
              )}
            </form.Field>
            <Button
              type="submit"
              loading={isPending}
              size="lg"
              color="primary"
              variant="solid"
              className="w-full rounded-2xl transition hover:-translate-y-0.5"
              sx={{
                boxShadow:
                  "0 16px 36px color-mix(in srgb, var(--joy-palette-primary-solidBg) 35%, transparent)",
              }}
            >
              {t("login")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
