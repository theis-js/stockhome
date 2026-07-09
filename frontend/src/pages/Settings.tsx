import { Button, Chip, CircularProgress, Divider, Input, Sheet, Typography, } from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import type { AlertInterface, SettingsIntf } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { fetchSettings, mutateSettings } from "../utils/api/settings";
import { useEffect, useState } from "react";
import { ChangePasswordModal } from "../components/modals/ChangePasswordModal";
import { MyAlert } from "../components/MyAlert.tsx";

export const Settings = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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

  return (
    <>
      <ChangePasswordModal alert={setAlert} isOpen={modal} setOpen={setModal} />
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <Typography
              level="h2"
              sx={{ color: "var(--joy-palette-text-primary)" }}
            >
              {t("settings")}
            </Typography>
            <Typography
              level="body-lg"
              sx={{ color: "var(--joy-palette-text-tertiary)" }}
            >
              {t("settings-sub")}
            </Typography>
          </div>
          <Chip
            variant="soft"
            color="primary"
            className="ml-auto rounded-full px-3"
          >
            {t("preferences")}
          </Chip>
        </div>
      </div>

      <Sheet
        className="mt-6 rounded-3xl p-6 backdrop-blur"
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.surface",
          boxShadow:
            "0 24px 60px rgba(var(--joy-palette-primary-900, 12 38 78) / 0.12)",
        }}
      >
        {alert.isAlert && (
          <MyAlert type={alert.type} header={alert.header} text={alert.text} />
        )}
        {settingsPending ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress size="lg" />
          </div>
        ) : (
          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <div className="grid gap-6 lg:grid-cols-[1.1fr\_0.9fr]">
              <div className="space-y-5">
                <div className="space-y-1">
                  <Typography
                    level="title-md"
                    sx={{ color: "var(--joy-palette-text-primary)" }}
                  >
                    {t("app-name")}
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{ color: "var(--joy-palette-text-tertiary)" }}
                  >
                    {t("app-name-sub")}
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
                        sx={{
                          bgcolor: "var(--joy-palette-background-surface)",
                          boxShadow: "0 10px 24px var(--joy-palette-divider)",
                        }}
                      />
                    )}
                  </form.Field>
                </div>
                <div className="space-y-1">
                  <Typography
                    level="title-md"
                    sx={{ color: "var(--joy-palette-text-primary)" }}
                  >
                    {t("currency")}
                  </Typography>
                  <Typography
                    level="body-sm"
                    sx={{ color: "var(--joy-palette-text-tertiary)" }}
                  >
                    {t("currency-sub")}
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
                        sx={{
                          bgcolor: "var(--joy-palette-background-surface)",
                          boxShadow: "0 10px 24px var(--joy-palette-divider)",
                        }}
                      />
                    )}
                  </form.Field>
                </div>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{
                  border: "1px solid var(--joy-palette-divider)",
                  background:
                    "linear-gradient(to bottom right, var(--joy-palette-primary-50), var(--joy-palette-background-level1), var(--joy-palette-background-level2))",
                  boxShadow: "0 16px 40px var(--joy-palette-divider)",
                }}
              >
                <Typography
                  level="title-lg"
                  sx={{ color: "var(--joy-palette-text-primary)" }}
                >
                  {t("quick-tips")}
                </Typography>
                <Divider className="my-3" />
                <div
                  className="space-y-3 text-md"
                  style={{ color: "var(--joy-palette-text-secondary)" }}
                >
                  <p>{t("quick-tips-1")}</p>
                  <p>{t("quick-tips-2")}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-3">
              <Button
                type="submit"
                size="lg"
                color="primary"
                className="rounded-2xl transition hover:-translate-y-0.5"
                sx={{
                  boxShadow:
                    "0 16px 36px color-mix(in srgb, var(--joy-palette-primary-solidBg) 35%, transparent)",
                }}
              >
                {t("save")}
              </Button>
              <Button
                onClick={() => setModal(true)}
                size="lg"
                color="primary"
                className="rounded-2xl transition hover:-translate-y-0.5"
                sx={{
                  boxShadow:
                    "0 16px 36px color-mix(in srgb, var(--joy-palette-primary-solidBg) 35%, transparent)",
                }}
              >
                {t("change-password")}
              </Button>
            </div>
          </form>
        )}
      </Sheet>
    </>
  );
};
