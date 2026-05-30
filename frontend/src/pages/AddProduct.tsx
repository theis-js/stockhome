import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Alert,
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
import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { createProduct } from "../utils/api/products";
import { getStorages } from "../utils/api/storages";
import type { ProductFormValues } from "../misc/interfaces";
import Cookies from "js-cookie";

export const AddProduct = () => {
  const { t } = useTranslation();
  const [success, setSuccess] = useState(false);

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
      setSuccess(false);
      mutate(value);
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (values: ProductFormValues) => createProduct(values),
    onSuccess: () => {
      setSuccess(true);
    },
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <Typography level="h2" className="text-slate-900">
              {t("add-product")}
            </Typography>
            <Typography level="body-lg" className="text-slate-500">
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
                <Typography level="title-md" className="text-slate-900">
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
    </>
  );
};
