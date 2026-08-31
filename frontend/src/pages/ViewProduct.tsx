import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorages } from "../utils/api/storages.ts";
import { Button, CircularProgress, Input, Option, Select, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import {
  deleteSelectedProducts,
  getProductDetails,
  mutateProduct,
} from "../utils/api/products.ts";
import { toInputDate } from "../utils/uxFncs";
import type {
  AlertInterface,
  productDetailsInterface,
  ProductFormValues,
  Storage,
} from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { QrCode, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import QRCode from "qrcode";
import { AmountStepper } from "../components/AmountStepper.tsx";
import { ExpiryBadge } from "../components/ProductStatusBar.tsx";
import { MyAlert } from "../components/MyAlert.tsx";

const cardSx = {
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.surface",
} as const;

interface ViewProductProps {
  uuid: string;
}

export const ViewProduct = (props: ViewProductProps) => {
  const uuid = props.uuid;
  const { t } = useTranslation();
  const navigate = useNavigate();
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

  const { mutate: deleteProduct, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteSelectedProducts([uuid]),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      void navigate({ to: "/app/inventory" });
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

  const downloadQRcode = async () => {
    const baseUrl: string = `${window.location.protocol}//${window.location.host}`;
    const url = `${baseUrl}/app/quick-view/product?uuid=${uuid}`;

    const dataUrl = await QRCode.toDataURL(url, { width: 300, margin: 2 });

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Typography level="h2" sx={{ color: "var(--joy-palette-text-primary)" }}>
          {isSuccess ? productDetails.name : t("product-details")}
        </Typography>
        {isSuccess && <ExpiryBadge expiryDate={productDetails.expiry_date} />}
        <Button
          startDecorator={<Trash2 size={16} />}
          color="danger"
          variant="outlined"
          size="sm"
          className="ml-auto rounded-2xl"
          loading={isDeleting}
          onClick={() => deleteProduct()}
        >
          {t("delete")}
        </Button>
      </div>
      {productDetailsLoading && <CircularProgress size="sm" />}

      {isSuccess && (
        <form
          className="space-y-6"
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
              </div>

              <div
                className="mt-4 flex items-center gap-3 rounded-2xl p-4"
                style={{ backgroundColor: "var(--joy-palette-background-level1)" }}
              >
                <QrCode size={20} color="var(--joy-palette-text-tertiary)" className="shrink-0" />
                <div className="min-w-0">
                  <Typography level="title-md" sx={{ color: "var(--joy-palette-text-primary)" }}>
                    {t("jar-label")}
                  </Typography>
                  <Typography level="body-sm" className="normal-case font-normal" sx={{ color: "var(--joy-palette-text-tertiary)" }}>
                    {t("jar-label-hint")}
                  </Typography>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <Button
              type="button"
              startDecorator={<QrCode size={16} />}
              onClick={() => downloadQRcode()}
              size="lg"
              variant="outlined"
              color="neutral"
              className="rounded-2xl"
            >
              {t("download-qr-code")}
            </Button>
            <Button type="submit" loading={isPending} size="lg" color="primary" variant="solid" className="btn-lift rounded-2xl">
              {t("save")}
            </Button>
          </div>

          {alert.isAlert && (
            <MyAlert type={alert.type} header={alert.header} text={alert.text} />
          )}
        </form>
      )}
    </div>
  );
};
