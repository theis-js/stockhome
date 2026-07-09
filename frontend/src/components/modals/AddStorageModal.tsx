import { Button, DialogContent, DialogTitle, Input, Modal, ModalDialog, Stack, } from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { AlertInterface, NewStorage } from "../../misc/interfaces";
import { mutateNewStorage } from "../../utils/api/storages";
import { useState } from "react";
import { MyAlert } from "../MyAlert.tsx";

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
            {t("new-storage-title")}
          </DialogTitle>
          <DialogContent sx={{ color: "var(--joy-palette-text-tertiary)" }}>
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
                    className="rounded-2xl"
                    sx={{
                      bgcolor: "var(--joy-palette-background-surface)",
                      boxShadow: "0 10px 24px var(--joy-palette-divider)",
                    }}
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
                {t("submit")}
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
