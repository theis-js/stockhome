import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Box,
  Button,
  Chip,
  Divider,
  Input,
  Option,
  Select,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { createProduct } from "../utils/api/products";
import { getStorages } from "../utils/api/storages";
import type {
  AlertInterface,
  ProductFormValues,
  Storage,
} from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import Cookies from "js-cookie";
import { MyAlert } from "../components/MyAlert.tsx";

export const AddProduct = () => {
  const { t } = useTranslation();
  const [alert, setAlert] = useState<AlertInterface>({
    isAlert: false,
    type: "neutral",
    header: "",
    text: "",
  });

  const showError = (error: unknown) => {
    const errorCode = (error as { code?: string })?.code;
    setAlert({
      isAlert: true,
      type: "danger",
      header: t("error"),
      text: errorCode ? t(errorCode) : t("unknown-error"),
    });
  };

  const {
    data: storages,
    isError: storagesError,
    error: storagesErrorObj,
  } = useQuery<Storage[], ApiError>({
    queryKey: ["storages"],
    queryFn: () => getStorages(),
  });

  useEffect(() => {
    if (storagesError && storagesErrorObj) {
      showError(storagesErrorObj);
    }
  }, [storagesError, storagesErrorObj]);

  const form = useForm({
    defaultValues: {
      amount: 0,
      bottling_date: "",
      description: "",
      expiry_date: "",
      name: "",
      price: "",
      storage_location_uuid: "",
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ProductFormValues) => createProduct(values),
    onSuccess: () => {
      setAlert({
        isAlert: true,
        type: "success",
        header: "",
        text: "",
      });
    },
    onError: showError,
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <Typography
              level="h2"
              sx={{ color: "var(--joy-palette-text-primary)" }}
            >
              {t("add-product")}
            </Typography>
            <Typography
              level="body-lg"
              sx={{ color: "var(--joy-palette-text-tertiary)" }}
            >
              {t("add-product-subtitle")}
            </Typography>
          </div>
          <Chip
            variant="soft"
            color="primary"
            className="ml-auto rounded-full px-3"
          >
            {t("details")}
          </Chip>
        </div>
      </div>
      <Box
        className="mt-6 rounded-3xl p-6 backdrop-blur"
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.surface",
          boxShadow:
            "0 24px 60px color-mix(in srgb, var(--joy-palette-primary-800) 12%, transparent)",
        }}
      >
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <div className="space-y-1">
                <Typography
                  level="title-md"
                  sx={{ color: "var(--joy-palette-text-primary)" }}
                >
                  {t("product-name")}
                </Typography>
                <form.Field name="name">
                  {(field) => (
                    <Input
                      type="text"
                      required
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      size="lg"
                      variant="outlined"
                      className="rounded-2xl"
                      sx={{
                        bgcolor: "var(--joy-palette-background-surface)",
                        boxShadow: "0 10px 24px var(--joy-palette-divider)",
                      }}
                    />
                  )}
                </form.Field>
              </div>
              <div className="space-y-1">
                <Typography
                  level="title-md"
                  sx={{ color: "var(--joy-palette-text-primary)" }}
                >
                  {t("description")}
                </Typography>
                <form.Field name="description">
                  {(field) => (
                    <Input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      size="lg"
                      variant="outlined"
                      className="rounded-2xl"
                      sx={{
                        bgcolor: "var(--joy-palette-background-surface)",
                        boxShadow: "0 10px 24px var(--joy-palette-divider)",
                      }}
                    />
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <Typography
                    level="title-md"
                    sx={{ color: "var(--joy-palette-text-primary)" }}
                  >
                    {t("expiry-date")}
                  </Typography>
                  <form.Field name="expiry_date">
                    {(field) => (
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        size="lg"
                        variant="outlined"
                        className="rounded-2xl"
                        sx={{
                          bgcolor: "var(--joy-palette-background-surface)",
                        }}
                      />
                    )}
                  </form.Field>
                </div>
                <div className="space-y-1">
                  <Typography
                    level="title-md"
                    sx={{ color: "var(--joy-palette-text-primary)" }}
                  >
                    {t("bottling-date")}
                  </Typography>
                  <form.Field name="bottling_date">
                    {(field) => (
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        size="lg"
                        variant="outlined"
                        className="rounded-2xl"
                        sx={{
                          bgcolor: "var(--joy-palette-background-surface)",
                        }}
                      />
                    )}
                  </form.Field>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div
                className="rounded-2xl p-5"
                style={{
                  border: "1px solid var(--joy-palette-divider)",
                  background:
                    "linear-gradient(to bottom right, var(--joy-palette-primary-50), var(--joy-palette-background-level1), var(--joy-palette-background-level2))",
                  boxShadow: "0 16px 40px var(--joy-palette-divider)",
                }}
              >
                <Typography
                  level="title-md"
                  sx={{ color: "var(--joy-palette-text-primary)" }}
                >
                  {t("inventory")}
                </Typography>
                <Divider className="my-3" />
                <div className="grid gap-4">
                  <div className="space-y-1">
                    <Typography
                      level="title-md"
                      sx={{ color: "var(--joy-palette-text-primary)" }}
                    >
                      {t("amount")}
                    </Typography>
                    <form.Field name="amount">
                      {(field) => (
                        <Input
                          type="number"
                          color="neutral"
                          id="amountInput"
                          placeholder={t("amount")}
                          value={field.state.value}
                          variant="soft"
                          size="lg"
                          onChange={(e) => {
                            const nextValue = Number(e.target.value);
                            field.handleChange(
                              Number.isNaN(nextValue) ? 0 : nextValue,
                            );
                          }}
                          onBlur={field.handleBlur}
                          className="rounded-2xl"
                          sx={{
                            bgcolor: "var(--joy-palette-background-surface)",
                          }}
                        />
                      )}
                    </form.Field>
                  </div>
                  <div className="space-y-1">
                    <Typography
                      level="title-md"
                      sx={{ color: "var(--joy-palette-text-primary)" }}
                    >
                      {t("price")}
                    </Typography>
                    <form.Field name="price">
                      {(field) => (
                        <Input
                          type="text"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          size="lg"
                          variant="outlined"
                          className="rounded-2xl"
                          sx={{
                            bgcolor: "var(--joy-palette-background-surface)",
                          }}
                        />
                      )}
                    </form.Field>
                    <Typography
                      level="body-sm"
                      sx={{ color: "var(--joy-palette-text-tertiary)" }}
                    >
                      {Cookies.get("currency")}
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography
                      level="title-md"
                      sx={{ color: "var(--joy-palette-text-primary)" }}
                    >
                      {t("storage-place")}
                    </Typography>
                    <form.Field name="storage_location_uuid">
                      {(field) => (
                        <Select
                          required
                          value={field.state.value}
                          onChange={(_event, value) =>
                            field.handleChange(value ?? "")
                          }
                          size="lg"
                          variant="outlined"
                          className="rounded-2xl"
                          sx={{
                            bgcolor: "var(--joy-palette-background-surface)",
                          }}
                        >
                          {storages?.map((storage) => (
                            <Option key={storage.uuid} value={storage.uuid}>
                              {storage.name}
                            </Option>
                          ))}
                        </Select>
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Typography
              level="body-sm"
              sx={{ color: "var(--joy-palette-text-tertiary)" }}
            >
              {t("product-details")}
            </Typography>
            <div className="grow"></div>
            <Button
              type="submit"
              loading={isPending}
              size="lg"
              color="primary"
              variant="solid"
              className="rounded-2xl transition hover:-translate-y-0.5"
              sx={{
                boxShadow:
                  "0 16px 36px color-mix(in srgb, var(--joy-palette-primary-solidBg) 35%, transparent)",
              }}
            >
              {t("save")}
            </Button>
          </div>
          {alert.isAlert && (
            <MyAlert
              type={alert.type}
              header={alert.header}
              text={alert.text}
            />
          )}
        </form>
      </Box>
    </>
  );
};
