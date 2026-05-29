import { Input, Button, CircularProgress } from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import type { SettingsIntf } from "../misc/interfaces";
import { mutateSettings, fetchSettings } from "../utils/uxFncs";
import { useEffect } from "react";

export const Settings = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const {
    data: settings,
    isPending: settingsPending,
    isSuccess: settingsSuccess,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });

  useEffect(() => {
    Cookies.set("app-name", settings?.data[0].value);
    Cookies.set("currency", settings?.data[1].value);
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
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });

  return (
    <>
      {settingsPending ? (
        <CircularProgress />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="app-name">
            {(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <form.Field name="currency">
            {(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            )}
          </form.Field>
          <Button type="submit">{t("submit")}</Button>
        </form>
      )}
    </>
  );
};
