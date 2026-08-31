import { Button, CircularProgress, Divider, Input, Sheet, Typography } from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import type { AlertInterface, SettingsIntf } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { fetchSettings, mutateSettings } from "../utils/api/settings";
import { useEffect, useState } from "react";
import { useColorScheme } from "@mui/joy/styles";
import { ChevronRight } from "lucide-react";
import { ChangePasswordModal } from "../components/modals/ChangePasswordModal";
import { MyAlert } from "../components/MyAlert.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { changeTranslation } from "../utils/uxFncs";
import { useLogout } from "../hooks/useLogout.ts";

const cardSx = {
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.surface",
} as const;

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { mode, setMode } = useColorScheme();
  const { logout } = useLogout();
  const [modal, setModal] = useState(false);
  const [alert, setAlert] = useState<AlertInterface>({
    isAlert: false,
    type: "neutral",
    header: "",
    text: "",
  });

  const showError = (error: unknown) => {
    const errorCode = (error as { code?: string })?.code;
    setAlert({
      isAlert: true,
      type: "danger",
      header: t("error"),
      text: errorCode ? t(errorCode) : t("unknown-error"),
    });
  };

  const {
    data: settings,
    isPending: settingsPending,
    isSuccess: settingsSuccess,
    isError: settingsError,
    error: settingsErrorObj,
  } = useQuery<{ data: { value: string }[] }, ApiError>({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    if (settingsError && settingsErrorObj) {
      showError(settingsErrorObj);
    }
  }, [settingsError, settingsErrorObj]);

  useEffect(() => {
    const appName = settings?.data?.[0]?.value;
    const currency = settings?.data?.[1]?.value;

    if (appName) {
      Cookies.set("app-name", appName);
    }

    if (currency) {
      Cookies.set("currency", currency);
    }
  }, [settingsSuccess]);

  const form = useForm({
    defaultValues: {
      "app-name": settings?.data[0].value ?? "",
      currency: settings?.data[1].value ?? "",
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  const { mutate } = useMutation({
    mutationFn: (values: SettingsIntf) => mutateSettings(values),
    onSuccess() {
      setAlert({
        isAlert: true,
        type: "success",
        header: t("success"),
        text: t("SE001"),
      });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: showError,
  });

  const segmentBtn = (active: boolean) => ({
    className: "rounded-xl px-4",
    variant: active ? ("solid" as const) : ("plain" as const),
    color: active ? ("primary" as const) : ("neutral" as const),
    sx: { color: active ? undefined : "var(--joy-palette-text-secondary)" },
  });

  return (
    <>
      <ChangePasswordModal alert={setAlert} isOpen={modal} setOpen={setModal} />
      <div className="space-y-6">
        <PageHeader title={t("settings")} subtitle={t("settings-sub")} />

        {alert.isAlert && (
          <MyAlert type={alert.type} header={alert.header} text={alert.text} />
        )}

        {settingsPending ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress size="lg" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-6">
              <Sheet className="rounded-3xl p-6" sx={cardSx}>
                <Typography level="title-lg" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("general")}
                </Typography>
                <Divider className="my-4" />
                <form
                  className="space-y-5"
                  onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                  }}
                >
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                        {t("app-name")}
                      </Typography>
                      <form.Field name="app-name">
                        {(field) => (
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            size="lg"
                            variant="outlined"
                            placeholder="Stockhome"
                            className="rounded-2xl"
                          />
                        )}
                      </form.Field>
                      <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                        {t("app-name-sub")}
                      </Typography>
                    </div>
                    <div className="space-y-1">
                      <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                        {t("currency")}
                      </Typography>
                      <form.Field name="currency">
                        {(field) => (
                          <Input
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            size="lg"
                            variant="outlined"
                            placeholder="EUR"
                            className="rounded-2xl"
                          />
                        )}
                      </form.Field>
                      <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                        {t("currency-sub")}
                      </Typography>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit" size="lg" color="primary" className="btn-lift rounded-2xl">
                      {t("save")}
                    </Button>
                  </div>
                </form>
              </Sheet>

              <Sheet className="rounded-3xl p-6" sx={cardSx}>
                <Typography level="title-lg" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("appearance-language")}
                </Typography>
                <Divider className="my-4" />
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                      {t("theme")}
                    </Typography>
                    <div className="inline-flex gap-1 rounded-2xl border border-solid p-1" style={{ borderColor: "var(--joy-palette-divider)" }}>
                      <Button {...segmentBtn(mode === "light")} onClick={() => setMode("light")}>
                        {t("theme-light")}
                      </Button>
                      <Button {...segmentBtn(mode === "dark")} onClick={() => setMode("dark")}>
                        {t("theme-dark")}
                      </Button>
                      <Button {...segmentBtn(mode === "system")} onClick={() => setMode("system")}>
                        {t("theme-system")}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                      {t("language")}
                    </Typography>
                    <div className="inline-flex gap-1 rounded-2xl border border-solid p-1" style={{ borderColor: "var(--joy-palette-divider)" }}>
                      <Button
                        {...segmentBtn(i18n.language === "de")}
                        onClick={() => i18n.language !== "de" && changeTranslation()}
                      >
                        Deutsch
                      </Button>
                      <Button
                        {...segmentBtn(i18n.language === "en")}
                        onClick={() => i18n.language !== "en" && changeTranslation()}
                      >
                        English
                      </Button>
                    </div>
                  </div>
                </div>
              </Sheet>

              <Sheet className="rounded-3xl p-6" sx={cardSx}>
                <Typography level="title-lg" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("account")}
                </Typography>
                <Divider className="my-4" />
                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => setModal(true)}
                    className="flex w-full items-center justify-between rounded-2xl px-1 py-1 text-left"
                  >
                    <div>
                      <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                        {t("change-password")}
                      </Typography>
                    </div>
                    <ChevronRight size={18} color="var(--joy-palette-text-tertiary)" />
                  </button>
                  <Divider />
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography level="title-md" sx={{ color: "var(--joy-palette-danger-solidBg)" }}>
                        {t("sign-out")}
                      </Typography>
                      <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                        {t("sign-out-sub")}
                      </Typography>
                    </div>
                    <Button color="danger" variant="outlined" className="rounded-2xl" onClick={logout}>
                      {t("logout")}
                    </Button>
                  </div>
                </div>
              </Sheet>
            </div>

            <div
              className="rounded-3xl p-6"
              style={{
                border: "1px solid var(--joy-palette-divider)",
                background:
                  "linear-gradient(to bottom right, var(--joy-palette-primary-50), var(--joy-palette-background-level1), var(--joy-palette-background-level2))",
              }}
            >
              <Typography level="title-lg" sx={{ color: "var(--joy-palette-text-primary)" }}>
                {t("quick-tips")}
              </Typography>
              <Divider className="my-3" />
              <div className="space-y-3 text-md" style={{ color: "var(--joy-palette-text-secondary)" }}>
                <p>{t("quick-tips-1")}</p>
                <p>{t("quick-tips-2")}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
