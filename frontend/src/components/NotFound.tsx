import { Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";

export const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className={"flex flex-col items-center gap-2"}>
      <Typography color={"primary"} level={"h1"}>
        {t("not-found-header")}
      </Typography>
      <Typography
        sx={{ color: "var(--joy-palette-text-primary)" }}
        level={"body-lg"}
      >
        {t("not-found-body")}
      </Typography>
    </div>
  );
};
