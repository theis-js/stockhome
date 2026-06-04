import {
  Modal,
  ModalDialog,
  DialogTitle,
  Stack,
  Input,
  Button,
  Alert,
} from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { ChangePasswordIntf, AlertInterface } from "../../misc/interfaces";
import { mutatePassword } from "../../utils/api/auth";
import { useState } from "react";

interface ChangePasswordProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
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
      mutate(value);
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
      props.setOpen(false);
    },
  });

  return (
    <>
      <Modal open={props.isOpen} onClose={() => props.setOpen(false)}>
        <ModalDialog className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(12,38,78,0.2)] backdrop-blur">
          <DialogTitle className="text-slate-900">
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
                    className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
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
                    className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
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
                    className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                  />
                )}
              </form.Field>
              <Button
                type="submit"
                size="lg"
                className="rounded-2xl bg-[#0b6bcb] text-white shadow-[0_16px_36px_rgba(11,107,203,0.35)] transition hover:-translate-y-0.5 hover:bg-[#095aa7]"
              >
                {t("change")}
              </Button>
            </Stack>
          </form>
          {alert.isAlert && (
            <Alert
              variant="soft"
              color={alert.type}
              className="mt-4 rounded-2xl border border-rose-200/70 bg-rose-50/80 text-rose-700 shadow-[0_12px_30px_rgba(220,38,38,0.12)]"
            >
              {alert.header}
              <br />
              {alert.text}
            </Alert>
          )}
        </ModalDialog>
      </Modal>
    </>
  );
};
