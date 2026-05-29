import { useQueryClient, useMutation } from "@tanstack/react-query";
import { updateStorage } from "../utils/uxFncs";
import { useForm } from "@tanstack/react-form";
import { useStore } from "@tanstack/react-store";
import { Input, Button } from "@mui/joy";
import type { Storage } from "../misc/interfaces";
import { formatDate } from "../utils/uxFncs";

interface StorageRowProps {
  storage: Storage;
}

export const StorageRow = ({ storage }: StorageRowProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (values: Pick<Storage, "name" | "description">) =>
      updateStorage(storage.uuid, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["storages"] });
    },
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
    <tr key={storage.uuid}>
      <td>
        <form.Field name="name">
          {(field) => (
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              size="sm"
            />
          )}
        </form.Field>
      </td>
      <td>
        <form.Field name="description">
          {(field) => (
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              size="sm"
            />
          )}
        </form.Field>
      </td>
      <td>{formatDate(storage.created_at)}</td>
      <td>{formatDate(storage.updated_at)}</td>
      <td>
        <Button
          color="primary"
          onClick={form.handleSubmit}
          disabled={!isDirty || mutation.isPending}
        >
          {mutation.isPending ? "..." : "Save"}
        </Button>
        <Button
          color="danger"
          onClick={() => console.log("Delete Storage: " + storage.uuid)}
        >
          {mutation.isPending ? "..." : "Delete"}
        </Button>
      </td>
    </tr>
  );
};
