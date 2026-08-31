import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorages } from "../utils/api/storages.ts";
import { Button, Chip, CircularProgress, Option, Select, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { getProductDetails, mutateProduct } from "../utils/api/products.ts";
import { toInputDate } from "../utils/uxFncs";
import type {
  AlertInterface,
  productDetailsInterface,
  ProductFormValues,
  Storage,
} from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { AmountStepper } from "../components/AmountStepper.tsx";
import { ExpiryBadge } from "../components/ProductStatusBar.tsx";
import { MyAlert } from "../components/MyAlert.tsx";

export const ProductQuickView = () => {
  const uuid = window.location.search.split("uuid=")[1];
  const { t } = useTranslation();
  const queryClient = useQueryClient();
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
    data: productDetails,
    isLoading: productDetailsLoading,
    isSuccess,
    isError: productDetailsError,
    error: productDetailsErrorObj,
  } = useQuery<productDetailsInterface, ApiError>({
    queryKey: ["product", uuid],
    queryFn: () => getProductDetails(uuid),
  });

  const {
    data: storages,
    isError: storagesError,
    error: storagesErrorObj,
  } = useQuery<Storage[], ApiError>({
    queryKey: ["storages"],
    queryFn: () => getStorages(),
  });

  useEffect(() => {
    if (productDetailsError && productDetailsErrorObj) {
      showError(productDetailsErrorObj);
    }
  }, [productDetailsError, productDetailsErrorObj]);

  useEffect(() => {
    if (storagesError && storagesErrorObj) {
      showError(storagesErrorObj);
    }
  }, [storagesError, storagesErrorObj]);

  // Only Amount/Expiry/Storage are shown here — name/description/bottling
  // date/price stay in form state untouched and are sent back as-is on save.
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
      if (!productDetails?.uuid) {
        return;
      }

      mutate({ values: value, uuid: productDetails.uuid });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: ({ values, uuid }: { values: ProductFormValues; uuid: string }) =>
      mutateProduct(values, uuid),
    onSuccess: (_data, variables) => {
      setAlert({ isAlert: true, type: "success", header: t("success"), text: t("save") });
      queryClient.invalidateQueries({ queryKey: ["product", variables.uuid] });
    },
    onError: showError,
  });

  useEffect(() => {
    if (!productDetails) {
      return;
    }

    form.setFieldValue("amount", productDetails.amount ?? 0);
    form.setFieldValue("bottling_date", toInputDate(productDetails.bottling_date));
    form.setFieldValue("description", productDetails.description ?? "");
    form.setFieldValue("expiry_date", toInputDate(productDetails.expiry_date));
    form.setFieldValue("name", productDetails.name ?? "");
    form.setFieldValue("price", productDetails.price ?? "");
    form.setFieldValue("storage_location_uuid", productDetails.storage_location_uuid ?? "");
  }, [form, productDetails]);

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-10 sm:items-center" style={{ backgroundColor: "var(--joy-palette-background-body)" }}>
      <div className="w-full max-w-md space-y-5">
        <Chip variant="soft" color="warning" size="sm" className="rounded-full px-3 font-semibold">
          {t("scanned-badge")}
        </Chip>

        {productDetailsLoading && <CircularProgress size="sm" />}

        {isSuccess && (
          <>
            <div className="space-y-1">
              <Typography level="h2" sx={{ color: "var(--joy-palette-text-primary)" }}>
                {productDetails.name}
              </Typography>
              <Typography level="body-lg" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                {t("opened-from-jar-label")}
              </Typography>
              <ExpiryBadge expiryDate={productDetails.expiry_date} />
            </div>

            <form
              className="space-y-5 rounded-3xl p-6"
              style={{ border: "1px solid var(--joy-palette-divider)", backgroundColor: "var(--joy-palette-background-surface)" }}
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
            >
              <div className="space-y-1 text-center">
                <Typography level="body-sm" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                  {t("amount-in-storage")}
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
                <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                  {t("set-to-zero-hint")}
                </Typography>
              </div>

              <div
                className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{ border: "1px solid var(--joy-palette-divider)" }}
              >
                <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("expiry-date")}
                </Typography>
                <form.Field name="expiry_date">
                  {(field) => (
                    <input
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      className="border-none bg-transparent text-right font-semibold outline-none"
                      style={{ color: "var(--joy-palette-danger-solidBg)" }}
                    />
                  )}
                </form.Field>
              </div>

              <div
                className="flex items-center justify-between rounded-2xl px-4 py-3"
                style={{ border: "1px solid var(--joy-palette-divider)" }}
              >
                <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                  {t("storage-place")}
                </Typography>
                <form.Field name="storage_location_uuid">
                  {(field) => (
                    <Select
                      value={field.state.value}
                      onChange={(_event, value) => field.handleChange(value ?? "")}
                      variant="plain"
                      size="sm"
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

              <Link
                to="/app/view-product"
                search={{ product: uuid }}
                className="block text-center text-sm font-semibold hover:underline"
                style={{ color: "var(--joy-palette-primary-solidBg)" }}
              >
                {t("open-full-details")}
              </Link>

              {alert.isAlert && (
                <MyAlert type={alert.type} header={alert.header} text={alert.text} />
              )}

              <Button type="submit" loading={isPending} size="lg" color="primary" variant="solid" className="btn-lift w-full rounded-2xl">
                {t("save")}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
