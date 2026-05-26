import { useQuery } from "@tanstack/react-query";
import { getProductDetails } from "../utils/uxFncs";
import { CircularProgress, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

interface ViewProductProps {
  uuid: string;
}

export const ViewProduct = (props: ViewProductProps) => {
  const uuid = props.uuid;
  const { t } = useTranslation();

  const { data: productDetails, isLoading: productDetailsLoading } = useQuery({
    queryKey: ["product", uuid],
    queryFn: () => getProductDetails(uuid),
  });

  return (
    <>
      <Typography>{t("product-details")}</Typography>
      {productDetailsLoading && <CircularProgress size="sm" />}
    </>
  );
};
