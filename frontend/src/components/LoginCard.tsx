import { useForm } from "@tanstack/react-form";
import { Input, Button, Alert } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { signInUser } from "../utils/api/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import type { AlertInterface } from "../misc/interfaces";

export const LoginCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [alert, setAlert] = useState<AlertInterface>({
    isAlert: false,
    type: "neutral",
    header: "",
    text: "",
  });

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
        navigate({ to: "/app/inventory" });
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
    <div className="flex min-h-screen w-full items-center justify-center bg-[radial-gradient(1200px_circle_at_20%_10%,#e6f2ff_0%,#f7f9fc_40%,#f1f5fb_100%)] px-6 py-10">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-center">
        <div className="w-full max-w-md rounded-3xl border border-white/70 bg-white/80 p-8 shadow-[0_24px_60px_rgba(12,38,78,0.18)] backdrop-blur">
          <div className="mb-8 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#0b6bcb]">
              Stockhome
            </p>
            <h1 className="text-3xl font-semibold text-slate-900">
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
              <Alert
                variant="soft"
                color={alert.type}
                className="rounded-2xl border border-rose-200/70 bg-rose-50/80 text-rose-700 shadow-[0_12px_30px_rgba(220,38,38,0.12)]"
              >
                {alert.header}
                <br />
                {alert.text}
              </Alert>
            )}
            <form.Field name="username">
              {(field) => (
                <Input
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={t("username")}
                  variant="outlined"
                  size="lg"
                  className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
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
                  className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                />
              )}
            </form.Field>
            <Button
              type="submit"
              loading={isPending}
              size="lg"
              className="w-full rounded-2xl bg-[#0b6bcb] text-white shadow-[0_16px_36px_rgba(11,107,203,0.35)] transition hover:-translate-y-0.5 hover:bg-[#095aa7]"
            >
              {t("login")}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
