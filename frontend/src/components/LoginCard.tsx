import { useForm } from "@tanstack/react-form";
import { Input, Button } from "@mui/joy";
import { useMutation } from "@tanstack/react-query";
import { signInUser } from "../utils/auth";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";

export const LoginCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      mutate({ username: value.username, password: value.password });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => signInUser(username, password, t),
    onSuccess: (result) => {
      if (result.ok) {
        navigate({ to: "/app/inventory" });
      }
    },
  });

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <form.Field name="username">
          {(field) => (
            <Input
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={t("username")}
            />
          )}
        </form.Field>
        <form.Field name="password">
          {(field) => (
            <Input
              value={field.state.value}
              type="password"
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder={t("password")}
            />
          )}
        </form.Field>
        <Button type="submit" loading={isPending}>
          {t("login")}
        </Button>
      </form>
    </>
  );
};
