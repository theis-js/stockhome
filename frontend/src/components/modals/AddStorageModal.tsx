import {
  Alert,
  Button,
  DialogContent,
  DialogTitle,
  Input,
  Modal,
  ModalDialog,
  Stack,
} from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { AlertInterface, NewStorage } from "../../misc/interfaces";
import { mutateNewStorage } from "../../utils/api/storages";
import { useState } from "react";

interface AddStorageModalProps {
  isOpen: boolean;
  setOpen: (value: boolean) => void;
}

export const AddStorageModal = (props: AddStorageModalProps) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [alert, setAlert] = useState<AlertInterface>({
    isAlert: false,
    type: "neutral",
    header: "",
    text: "",
  });

  const form = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  const { mutate } = useMutation({
    mutationFn: (values: NewStorage) => mutateNewStorage(values),
    onError: (error: { code?: string }) => {
      setAlert({
        isAlert: true,
        type: "danger",
        header: t("error"),
        text: error.code ? t(error.code) : t("unknown-error"),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
      props.setOpen(false);
    },
  });

  return (
    <>
      <Modal open={props.isOpen} onClose={() => props.setOpen(false)}>
        <ModalDialog className="rounded-3xl border border-white/70 bg-white/90 p-6 shadow-[0_30px_70px_rgba(12,38,78,0.2)] backdrop-blur">
          <DialogTitle className="text-slate-900">
            {t("new-storage-title")}
          </DialogTitle>
          <DialogContent className="text-slate-500">
            {t("new-storage-content")}
          </DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <Stack spacing={2} className="mt-4">
              <form.Field name="name">
                {(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("storage-name")}
                    variant="outlined"
                    size="lg"
                    className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                  />
                )}
              </form.Field>
              <form.Field name="description">
                {(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("description")}
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
                {t("submit")}
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
