import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProductDetails, getStorages } from "../utils/uxFncs";
import {
  CircularProgress,
  Typography,
  Select,
  Option,
  Input,
  Button,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useForm } from "@tanstack/react-form";
import { mutateProduct } from "../utils/uxFncs";
import { toInputDate } from "../utils/uxFncs";
import type { ProductFormValues } from "../misc/interfaces";
import type { productDetailsInterface } from "../misc/interfaces";

interface ViewProductProps {
  uuid: string;
}

export const ViewProduct = (props: ViewProductProps) => {
  const uuid = props.uuid;
  const { t } = useTranslation();
  const queryClient = useQueryClient();

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

  return (
    <>
      <Typography level="h2">{t("product-details")}</Typography>
      {productDetailsLoading && <CircularProgress size="sm" />}
      {isSuccess && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            <form.Field name="name">
              {(field) => (
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="description">
              {(field) => (
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            {t("expiry-date")}
            <form.Field name="expiry_date">
              {(field) => (
                <Input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            {t("bottling-date")}
            <form.Field name="bottling_date">
              {(field) => (
                <Input
                  type="date"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="amount">
              {(field) => (
                <Input
                  type="number"
                  color="neutral"
                  id="amountInput"
                  placeholder={t("amount")}
                  value={field.state.value}
                  variant="soft"
                  onChange={(e) => {
                    const nextValue = Number(e.target.value);
                    field.handleChange(Number.isNaN(nextValue) ? 0 : nextValue);
                  }}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            <form.Field name="price">
              {(field) => (
                <Input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              )}
            </form.Field>
            {t("currency")}
            <form.Field name="storage_location_uuid">
              {(field) => (
                <Select
                  value={field.state.value}
                  onChange={(_event, value) => field.handleChange(value ?? "")}
                >
                  {storages?.map((storage: { uuid: string; name: string }) => (
                    <Option key={storage.uuid} value={storage.uuid}>
                      {storage.name}
                    </Option>
                  ))}
                </Select>
              )}
            </form.Field>
            <Button type="submit" loading={isPending}>
              {t("save")}
            </Button>
          </form>
        </>
      )}
    </>
  );
};
