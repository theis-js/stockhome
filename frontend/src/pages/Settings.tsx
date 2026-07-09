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
            <Typography level="h2" className="text-slate-900">
              {t("settings")}
            </Typography>
            <Typography level="body-lg" className="text-slate-500">
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

      <Sheet className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(12,38,78,0.12)] backdrop-blur">
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
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="space-y-5">
                <div className="space-y-1">
                  <Typography level="title-md" className="text-slate-900">
                    {t("app-name")}
                  </Typography>
                  <Typography level="body-sm" className="text-slate-500">
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
                        className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                      />
                    )}
                  </form.Field>
                </div>
                <div className="space-y-1">
                  <Typography level="title-md" className="text-slate-900">
                    {t("currency")}
                  </Typography>
                  <Typography level="body-sm" className="text-slate-500">
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
                        className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                      />
                    )}
                  </form.Field>
                </div>
              </div>
              <div className="rounded-2xl border border-white/70 bg-linear-to-br from-[#f7fbff] via-[#f2f6fb] to-[#eef3f9] p-5 shadow-[0_16px_40px_rgba(12,38,78,0.08)]">
                <Typography level="title-lg" className="text-slate-900">
                  {t("quick-tips")}
                </Typography>
                <Divider className="my-3" />
                <div className="space-y-3 text-md text-slate-600">
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
                className="rounded-2xl text-white shadow-[0_16px_36px_rgba(11,107,203,0.35)] transition hover:-translate-y-0.5 hover:bg-[#095aa7]"
              >
                {t("save")}
              </Button>
              <Button
                onClick={() => setModal(true)}
                size="lg"
                color="warning"
                className="rounded-2xl text-white shadow-[0_16px_36px_rgba(11,107,203,0.35)] transition hover:-translate-y-0.5 hover:bg-[#095aa7]"
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
