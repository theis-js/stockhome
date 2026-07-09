import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteStorage, updateStorage } from "../utils/api/storages";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { Button, Input } from "@mui/joy";
import type { Storage } from "../misc/interfaces";
import { formatDate } from "../utils/uxFncs";
import { useTranslation } from "react-i18next";

interface StorageRowProps {
  storage: Storage;
  onError: (error: unknown) => void;
}

export const StorageRow = ({ storage, onError }: StorageRowProps) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Pick<Storage, "name" | "description">) =>
      updateStorage(storage.uuid, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
    },
    onError,
  });

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

  const values = useStore(form.baseStore, (state) => state.values);
  const isDirty =
    values.name !== storage.name ||
    (values.description ?? "") !== (storage.description ?? "");

  return (
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
        {formatDate(storage.created_at)}
      </td>
      <td
        className="px-6 py-5 text-sm"
        style={{ color: "var(--joy-palette-text-tertiary)" }}
      >
        {formatDate(storage.updated_at)}
      </td>
      <td className="px-6 py-5 text-right">
        <div className="flex flex-wrap justify-end gap-2">
          <Button
            color="primary"
            onClick={form.handleSubmit}
            disabled={
              !isDirty || mutation.isPending || deleteMutation.isPending
            }
            size="sm"
            className="rounded-xl"
          >
            {mutation.isPending ? "..." : t("save")}
          </Button>
          <Button
            color="danger"
            onClick={() => deleteMutation.mutateAsync(storage.uuid)}
            disabled={mutation.isPending || deleteMutation.isPending}
            size="sm"
            className="rounded-xl"
          >
            {deleteMutation.isPending ? "..." : t("delete")}
          </Button>
        </div>
      </td>
    </tr>
  );
};
