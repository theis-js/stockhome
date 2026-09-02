import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStorage, updateStorage } from "../utils/api/storages";
import { useForm } from "@tanstack/react-form";
import { Button, IconButton, Input } from "@mui/joy";
import { Trash2 } from "lucide-react";
import type { Storage } from "../misc/interfaces";
import { formatDate } from "../utils/uxFncs";
import { Mono } from "./Mono.tsx";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { DeleteConfirmation } from "./modals/DeleteConfirmation.tsx";

interface StorageRowProps {
  storage: Storage;
  onError: (error: unknown) => void;
}

export const StorageRow = ({ storage, onError }: StorageRowProps) => {
  const { t } = useTranslation();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [storageToDelete, setStorageToDelete] = useState<Storage | null>(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Pick<Storage, "name" | "description">) =>
      updateStorage(storage.uuid, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
    },
    onError,
  });

  const deleteStorageModalFnc = async (storage: Storage) => {
    setStorageToDelete(storage);
    setShowModal(true);
  };

  const deleteMutation = useMutation({
    mutationFn: (uuid: string) => deleteStorage(uuid),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
    },
    onError,
  });

  const form = useForm({
    defaultValues: {
      name: storage.name,
      description: storage.description ?? "",
    },
    onSubmit: async ({ value }) => {
      await mutation.mutateAsync(value);
    },
  });

  return (
    <>
      <DeleteConfirmation
        open={showModal}
        setOpen={setShowModal}
        storage={storageToDelete}
        deleteStorageByUUID={(uuid) => deleteMutation.mutateAsync(uuid)}
      />
      <tr key={storage.uuid} className="align-top">
        <td className="px-6 py-5">
          <form.Field name="name">
            {(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                size="sm"
                variant="outlined"
                className="rounded-xl shadow-none"
                sx={{
                  bgcolor: "var(--joy-palette-background-level1)",
                  color: "var(--joy-palette-text-secondary)",
                  "--Input-focusedHighlight": "var(--joy-palette-neutral-300)",
                }}
              />
            )}
          </form.Field>
        </td>
        <td className="px-6 py-5">
          <form.Field name="description">
            {(field) => (
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                size="sm"
                variant="outlined"
                className="rounded-xl shadow-none"
                sx={{
                  bgcolor: "var(--joy-palette-background-level1)",
                  color: "var(--joy-palette-text-secondary)",
                  "--Input-focusedHighlight": "var(--joy-palette-neutral-300)",
                }}
              />
            )}
          </form.Field>
        </td>
        <td
          className="px-6 py-5 text-sm"
          style={{ color: "var(--joy-palette-text-tertiary)" }}
        >
          <Mono>{formatDate(storage.created_at)}</Mono>
        </td>
        <td
          className="px-6 py-5 text-sm"
          style={{ color: "var(--joy-palette-text-tertiary)" }}
        >
          <Mono>{formatDate(storage.updated_at)}</Mono>
        </td>
        <td className="px-6 py-5 text-right">
          <div className="flex flex-wrap justify-end gap-2">
            <form.Subscribe
              selector={(state) =>
                state.values.name !== storage.name ||
                (state.values.description ?? "") !== (storage.description ?? "")
              }
            >
              {(isDirty) =>
                isDirty && (
                  <Button
                    color="primary"
                    onClick={form.handleSubmit}
                    disabled={mutation.isPending || deleteMutation.isPending}
                    size="sm"
                    className="rounded-xl"
                  >
                    {mutation.isPending ? "..." : t("save")}
                  </Button>
                )
              }
            </form.Subscribe>
            <IconButton
              color="danger"
              variant="plain"
              onClick={() => deleteStorageModalFnc(storage)}
              disabled={mutation.isPending || deleteMutation.isPending}
              size="sm"
              className="rounded-xl"
            >
              <Trash2 size={16} />
            </IconButton>
          </div>
        </td>
      </tr>
    </>
  );
};
