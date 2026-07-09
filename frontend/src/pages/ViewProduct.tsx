import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorages } from "../utils/api/storages.ts";
import { Box, Button, Chip, CircularProgress, Divider, Input, Option, Select, Typography, } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { getProductDetails, mutateProduct } from "../utils/api/products.ts";
import { toInputDate } from "../utils/uxFncs";
import type { AlertInterface, productDetailsInterface, ProductFormValues, Storage, } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Cookies from "js-cookie";
import QRCode from "qrcode";
import { MyAlert } from "../components/MyAlert.tsx";

interface ViewProductProps {
  uuid: string;
}

export const ViewProduct = (props: ViewProductProps) => {
  const uuid = props.uuid;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);
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
    mutationFn: ({
      values,
      uuid,
    }: {
      values: ProductFormValues;
      uuid: string;
    }) => mutateProduct(values, uuid),
    onSuccess: (_data, variables) => {
      setSuccess(true);
      queryClient.invalidateQueries({ queryKey: ["product", variables.uuid] });
    },
    onError: showError,
  });

  useEffect(() => {
    if (!productDetails) {
      return;
    }

    form.setFieldValue("amount", productDetails.amount ?? 0);
    form.setFieldValue(
      "bottling_date",
      toInputDate(productDetails.bottling_date),
    );
    form.setFieldValue("description", productDetails.description ?? "");
    form.setFieldValue("expiry_date", toInputDate(productDetails.expiry_date));
    form.setFieldValue("name", productDetails.name ?? "");
    form.setFieldValue("price", productDetails.price ?? "");
    form.setFieldValue(
      "storage_location_uuid",
      productDetails.storage_location_uuid ?? "",
    );
  }, [form, productDetails]);

  const downloadQRcode = async () => {
    const baseUrl: string = `${window.location.protocol}//${window.location.host}`;
    const url = `${baseUrl}/app/quick-view/product?uuid=${uuid}`;

    const dataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
    });

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = dataUrl;
    link.click();
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <Typography
              level="h2"
              sx={{ color: "var(--joy-palette-text-primary)" }}
            >
              {t("product-details")}
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
        {productDetailsLoading && <CircularProgress size="sm" />}
      </div>
      {isSuccess && (
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
                    level="title-lg"
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
            <div>
              <div className="flex gap-3 items-center">
                <Typography
                  level="body-sm"
                  sx={{ color: "var(--joy-palette-text-tertiary)" }}
                >
                  {t("product-details")}
                </Typography>
                <div className="grow"></div>
                <Button
                  startDecorator={<QrCodeIcon />}
                  loading={isPending}
                  onClick={() => downloadQRcode()}
                  size="lg"
                  color="primary"
                  variant="solid"
                  className="rounded-2xl transition hover:-translate-y-0.5"
                  sx={{
                    boxShadow:
                      "0 16px 36px color-mix(in srgb, var(--joy-palette-primary-solidBg) 35%, transparent)",
                  }}
                >
                  {t("download-qr-code")}
                </Button>
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
      )}
    </>
  );
};
