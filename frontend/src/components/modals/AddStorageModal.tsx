import {
  Modal,
  ModalDialog,
  DialogTitle,
  DialogContent,
  Stack,
  Input,
  Button,
  Alert,
} from "@mui/joy";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import type { NewStorage, AlertInterface } from "../../misc/interfaces";
import { mutateNewStorage } from "../../utils/uxFncs";
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
        text: error.code ? t(`errors.${error.code}`) : t("unknown-error"),
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
        <ModalDialog>
          <DialogTitle>{t("new-storage-title")}</DialogTitle>
          <DialogContent>{t("new-storage-content")}</DialogContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <Stack>
              <form.Field name="name">
                {(field) => (
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={t("storage-name")}
                    variant="outlined"
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
                  />
                )}
              </form.Field>
              <Button type="submit">{t("submit")}</Button>
            </Stack>
          </form>
          {alert.isAlert && (
            <Alert variant="soft" color={alert.type}>
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
