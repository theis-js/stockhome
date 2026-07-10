import {
  Button,
  DialogTitle,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { AlertInterface, ChangePasswordIntf } from "../../misc/interfaces";
import { mutatePassword } from "../../utils/api/auth";
import { useState } from "react";
import { USER_ERROR_CODE } from "@stockhome/shared";
import { MyAlert } from "../MyAlert.tsx";

interface ChangePasswordProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
  alert: (alert: AlertInterface) => void;
}

export const ChangePasswordModal = (props: ChangePasswordProps) => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<AlertInterface>({
    isAlert: false,
    type: "neutral",
    header: "",
    text: "",
  });

  const form = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      newPasswordRep: "",
    },
    onSubmit: async ({ value }) => {
      if (
        value.newPassword === value.newPasswordRep &&
        value.newPassword !== ""
      ) {
        mutate(value);
      } else {
        setAlert({
          isAlert: true,
          type: "danger",
          header: t("error"),
          text: t(USER_ERROR_CODE.PASSWORDS_NOT_MATCHED[0]),
        });
      }
    },
  });

  const { mutate } = useMutation({
    mutationFn: (values: ChangePasswordIntf) => mutatePassword(values),
    onError: (error: { code?: string }) => {
      setAlert({
        isAlert: true,
        type: "danger",
        header: t("error"),
        text: error.code ? t(error.code) : t("unknown-error"),
      });
    },
    onSuccess: () => {
      props.alert({
        isAlert: true,
        type: "success",
        header: t("success"),
        text: t("SU005"),
      });

      setAlert({
        isAlert: true,
        type: "success",
        header: t("success"),
        text: t("SU005"),
      });
      props.setOpen(false);
    },
  });

  return (
    <>
      <Modal open={props.isOpen} onClose={() => props.setOpen(false)}>
        <ModalDialog
          className="rounded-3xl p-6 backdrop-blur"
          sx={{
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.surface",
            boxShadow:
              "0 30px 70px color-mix(in srgb, var(--joy-palette-primary-800) 20%, transparent)",
          }}
        >
          <DialogTitle sx={{ color: "var(--joy-palette-text-primary)" }}>
            {t("new-password-title")}
          </DialogTitle>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <Stack spacing={2} className="mt-4">
              <form.Field name="currentPassword">
                {(field) => (
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("current-password")}
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
              <form.Field name="newPassword">
                {(field) => (
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("new-password")}
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
              <form.Field name="newPasswordRep">
                {(field) => (
                  <Input
                    type="password"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("new-password-rep")}
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
                size="lg"
                color="primary"
                variant="solid"
                className="rounded-2xl transition hover:-translate-y-0.5"
                sx={{
                  boxShadow:
                    "0 16px 36px color-mix(in srgb, var(--joy-palette-primary-solidBg) 35%, transparent)",
                }}
              >
                {t("change")}
              </Button>
            </Stack>
          </form>
          {alert.isAlert && (
            <MyAlert
              type={alert.type}
              header={alert.header}
              text={alert.text}
            />
          )}
        </ModalDialog>
      </Modal>
    </>
  );
};
