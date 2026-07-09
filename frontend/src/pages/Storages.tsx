import { useQuery } from "@tanstack/react-query";
import { getStorages } from "../utils/api/storages";
import { Button, CircularProgress, Sheet, Table, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import type { AlertInterface, Storage } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { StorageRow } from "../components/StorageRow";
import { useEffect, useState } from "react";
import { AddStorageModal } from "../components/modals/AddStorageModal";
import AddIcon from "@mui/icons-material/Add";
import { MyAlert } from "../components/MyAlert.tsx";

export const Storages = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
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
    isLoading,
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

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="min-w-65 space-y-2">
          <Typography level="h2" className="text-slate-900">
            {t("storages")}
          </Typography>
          <Typography level="body-lg" className="text-slate-500">
            {t("storage-delete-info")}
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <Button
            startDecorator={<AddIcon />}
            onClick={() => setModal(true)}
            variant="solid"
            className="rounded-full px-5 py-2 text-base font-semibold shadow-sm"
          >
            {t("add")}
          </Button>
        </div>
        {alert.isAlert && (
          <MyAlert type={alert.type} header={alert.header} text={alert.text} />
        )}
      </div>

      <Sheet
        variant="outlined"
        className="mt-6 flex min-h-0 w-full max-w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm sm:h-[calc(100vh-260px)]"
      >
        <AddStorageModal isOpen={modal} setOpen={setModal} />
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress size="lg" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 text-slate-700">
              <Typography level="body-lg" fontWeight="bold">
                {t("storages")}
              </Typography>
            </div>
            <div className="flex-1 overflow-auto">
              <Table
                stickyHeader
                stripe="odd"
                variant="plain"
                hoverRow
                className="w-full text-slate-700"
                sx={{
                  tableLayout: "fixed",
                  "--TableCell-headBackground":
                    "var(--joy-palette-background-surface)",
                  "& thead": {
                    position: "sticky",
                    top: 0,
                    zIndex: 3,
                    backgroundColor: "rgb(248 250 252)",
                  },
                  "& thead tr": {
                    backgroundColor: "rgb(248 250 252)",
                  },
                  "& thead th": {
                    zIndex: 2,
                    backgroundColor: "rgb(248 250 252)",
                    backgroundImage: "none",
                  },
                  "& thead th:nth-child(1)": {
                    width: "26%",
                    minWidth: "140px",
                  },
                  "& thead th:nth-child(2)": {
                    width: "34%",
                    minWidth: "160px",
                  },
                  "& thead th:nth-child(3)": {
                    width: "16%",
                    minWidth: "110px",
                  },
                  "& thead th:nth-child(4)": {
                    width: "16%",
                    minWidth: "110px",
                  },
                  "& thead th:nth-child(5)": {
                    width: "8%",
                    minWidth: "80px",
                  },
                  "& tr > *:nth-child(n+3)": { textAlign: "left" },
                }}
              >
                <thead>
                  <tr className="text-slate-600">
                    <th className="px-3 py-4">{t("storage-name")}</th>
                    <th className="px-3 py-4">{t("description")}</th>
                    <th className="px-3 py-4">{t("created-at")}</th>
                    <th className="px-3 py-4">{t("updated-at")}</th>
                    <th className="px-3 py-4 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  {storages?.map((storage: Storage) => (
                    <StorageRow
                      key={storage.uuid}
                      storage={storage}
                      onError={showError}
                    />
                  ))}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </Sheet>
    </>
  );
};
