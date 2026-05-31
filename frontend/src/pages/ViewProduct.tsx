import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getStorages } from "../utils/api/storages.ts";
import {
  CircularProgress,
  Typography,
  Select,
  Option,
  Input,
  Button,
  Chip,
  Divider,
  Box,
  Alert,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { mutateProduct, getProductDetails } from "../utils/api/products.ts";
import { toInputDate } from "../utils/uxFncs";
import type { ProductFormValues } from "../misc/interfaces";
import type { productDetailsInterface } from "../misc/interfaces";
import QrCodeIcon from "@mui/icons-material/QrCode";
import Cookies from "js-cookie";
import QRCode from "qrcode";

interface ViewProductProps {
  uuid: string;
}

export const ViewProduct = (props: ViewProductProps) => {
  const uuid = props.uuid;
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [success, setSuccess] = useState(false);

  const {
    data: productDetails,
    isLoading: productDetailsLoading,
    isSuccess,
  } = useQuery<productDetailsInterface>({
    queryKey: ["product", uuid],
    queryFn: () => getProductDetails(uuid),
  });

  const { data: storages } = useQuery({
    queryKey: ["storages"],
    queryFn: () => getStorages(),
  });

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
            <Typography level="h2" className="text-slate-900">
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
        <Box className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(12,38,78,0.12)] backdrop-blur">
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
                  <Typography level="title-md" className="text-slate-900">
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
                        className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                      />
                    )}
                  </form.Field>
                </div>
                <div className="space-y-1">
                  <Typography level="title-md" className="text-slate-900">
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
                        className="rounded-2xl bg-white/90 shadow-[0_10px_24px_rgba(15,23,42,0.08)]"
                      />
                    )}
                  </form.Field>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <Typography level="title-md" className="text-slate-900">
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
                          className="rounded-2xl bg-white/90"
                        />
                      )}
                    </form.Field>
                  </div>
                  <div className="space-y-1">
                    <Typography level="title-md" className="text-slate-900">
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
                          className="rounded-2xl bg-white/90"
                        />
                      )}
                    </form.Field>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-2xl border border-white/70 bg-linear-to-br from-[#f7fbff] via-[#f2f6fb] to-[#eef3f9] p-5 shadow-[0_16px_40px_rgba(12,38,78,0.08)]">
                  <Typography level="title-lg" className="text-slate-900">
                    {t("inventory")}
                  </Typography>
                  <Divider className="my-3" />
                  <div className="grid gap-4">
                    <div className="space-y-1">
                      <Typography level="title-md" className="text-slate-900">
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
                            className="rounded-2xl bg-white/80"
                          />
                        )}
                      </form.Field>
                    </div>
                    <div className="space-y-1">
                      <Typography level="title-md" className="text-slate-900">
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
                            className="rounded-2xl bg-white/90"
                          />
                        )}
                      </form.Field>
                      <Typography level="body-sm" className="text-slate-500">
                        {Cookies.get("currency")}
                      </Typography>
                    </div>
                    <div className="space-y-1">
                      <Typography level="title-md" className="text-slate-900">
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
                            className="rounded-2xl bg-white/90"
                          >
                            {storages?.map(
                              (storage: { uuid: string; name: string }) => (
                                <Option key={storage.uuid} value={storage.uuid}>
                                  {storage.name}
                                </Option>
                              ),
                            )}
                          </Select>
                        )}
                      </form.Field>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Typography level="body-sm" className="text-slate-500">
                {t("product-details")}
              </Typography>
              <Button
                startDecorator={<QrCodeIcon />}
                loading={isPending}
                onClick={() => downloadQRcode()}
                size="lg"
                className="rounded-2xl bg-[#0b6bcb] text-white shadow-[0_16px_36px_rgba(11,107,203,0.35)] transition hover:-translate-y-0.5 hover:bg-[#095aa7]"
              >
                {t("download-qr-code")}
              </Button>
              <Button
                type="submit"
                loading={isPending}
                size="lg"
                className="rounded-2xl bg-[#0b6bcb] text-white shadow-[0_16px_36px_rgba(11,107,203,0.35)] transition hover:-translate-y-0.5 hover:bg-[#095aa7]"
              >
                {t("save")}
              </Button>
            </div>
            {success && (
              <Alert
                color="success"
                variant="soft"
                className="rounded-2xl border border-emerald-200/70 bg-emerald-50/80 text-emerald-700 shadow-[0_14px_30px_rgba(16,185,129,0.18)]"
              >
                <div className="flex w-full items-center justify-between">
                  <Typography level="body-sm" className="text-emerald-700">
                    {t("success")}
                  </Typography>
                </div>
              </Alert>
            )}
          </form>
        </Box>
      )}
    </>
  );
};
