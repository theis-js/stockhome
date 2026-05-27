import { useQuery } from "@tanstack/react-query";
import { getProductDetails } from "../utils/uxFncs";
import { CircularProgress, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { formatDate } from "../utils/uxFncs";

interface productDetailsInterface {
  amount: number;
  bottling_date: string;
  description: string;
  expiry_date: string;
  name: string;
  picture: string | null;
  price: string;
  storage_location_name: string;
  storage_location_uuid: string;
  uuid: string;
}

interface ViewProductProps {
  uuid: string;
}

export const ViewProduct = (props: ViewProductProps) => {
  const uuid = props.uuid;
  const { t } = useTranslation();

  const {
    data: productDetails,
    isLoading: productDetailsLoading,
    isSuccess,
  } = useQuery<productDetailsInterface>({
    queryKey: ["product", uuid],
    queryFn: () => getProductDetails(uuid),
  });

  useEffect(() => {
    console.log(productDetails);
  }, [isSuccess]);

  return (
    <>
      <Typography level="h2">{t("product-details")}</Typography>
      {productDetailsLoading && <CircularProgress size="sm" />}
      {isSuccess && (
        <>
          <Typography level="h3">{productDetails.name}</Typography>
          <Typography level="body-lg">{productDetails.description}</Typography>
          <Typography level="body-lg">
            {t("expiry-date") + " " + formatDate(productDetails.expiry_date)}
          </Typography>
        </>
      )}
    </>
  );
};
