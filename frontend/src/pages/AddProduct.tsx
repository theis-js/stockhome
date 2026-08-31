import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Input, Option, Select, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { createProduct } from "../utils/api/products";
import { getStorages } from "../utils/api/storages";
import type { AlertInterface, ProductFormValues, Storage } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import Cookies from "js-cookie";
import { AmountStepper } from "../components/AmountStepper.tsx";
import { PageHeader } from "../components/PageHeader.tsx";
import { MyAlert } from "../components/MyAlert.tsx";

const cardSx = {
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.surface",
} as const;

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
    <div className="space-y-6">
      <PageHeader title={t("add-product")} subtitle={t("add-product-subtitle")} />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl p-6" style={cardSx}>
            <Typography level="title-lg" sx={{ color: "var(--joy-palette-text-primary)" }}>
              {t("product")}
            </Typography>
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("product-name")}
                </Typography>
                <form.Field name="name">
                  {(field) => (
                    <Input
                      type="text"
                      required
                      placeholder={t("product-name-placeholder")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      size="lg"
                      variant="outlined"
                      className="rounded-2xl"
                    />
                  )}
                </form.Field>
              </div>
              <div className="space-y-1">
                <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("description")}
                </Typography>
                <form.Field name="description">
                  {(field) => (
                    <Input
                      type="text"
                      placeholder={t("description-placeholder")}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      size="lg"
                      variant="outlined"
                      className="rounded-2xl"
                    />
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
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
                      />
                    )}
                  </form.Field>
                </div>
                <div className="space-y-1">
                  <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
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
                      />
                    )}
                  </form.Field>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl p-6" style={cardSx}>
            <Typography level="title-lg" sx={{ color: "var(--joy-palette-text-primary)" }}>
              {t("inventory")}
            </Typography>
            <div className="mt-4 space-y-4">
              <div className="space-y-1">
                <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("amount")}
                </Typography>
                <form.Field name="amount">
                  {(field) => (
                    <AmountStepper
                      value={field.state.value}
                      onChange={field.handleChange}
                      onBlur={field.handleBlur}
                    />
                  )}
                </form.Field>
              </div>
              <div className="space-y-1">
                <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
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
                      endDecorator={
                        <Typography level="body-sm" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                          {Cookies.get("currency")}
                        </Typography>
                      }
                    />
                  )}
                </form.Field>
              </div>
              <div className="space-y-1">
                <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("storage-place")}
                </Typography>
                <form.Field name="storage_location_uuid">
                  {(field) => (
                    <Select
                      required
                      placeholder={t("choose-storage")}
                      value={field.state.value}
                      onChange={(_event, value) => field.handleChange(value ?? "")}
                      size="lg"
                      variant="outlined"
                      className="rounded-2xl"
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
              <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                {t("amount-price-optional-hint")}
              </Typography>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
            {t("all-fields-editable-later")}
          </Typography>
          <div className="flex gap-3">
            <Button type="submit" loading={isPending} size="lg" color="primary" variant="solid" className="btn-lift rounded-2xl">
              {t("save-product")}
            </Button>
          </div>
        </div>

        {alert.isAlert && (
          <div className="mt-4">
            <MyAlert type={alert.type} header={alert.header} text={alert.text} />
          </div>
        )}
      </form>
    </div>
  );
};
