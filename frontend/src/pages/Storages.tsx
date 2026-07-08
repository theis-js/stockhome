import { useQuery } from "@tanstack/react-query";
import { getStorages } from "../utils/api/storages";
import {
  Alert,
  Button,
  CircularProgress,
  Sheet,
  Table,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import type { AlertInterface, Storage } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { StorageRow } from "../components/StorageRow";
import { useEffect, useState } from "react";
import { AddStorageModal } from "../components/modals/AddStorageModal";
import AddIcon from "@mui/icons-material/Add";

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
          <Alert
            variant="soft"
            color={alert.type}
            className="rounded-2xl border border-rose-200/70 bg-rose-50/80 text-rose-700 shadow-[0_12px_30px_rgba(220,38,38,0.12)]"
          >
            {alert.header}
            <br />
            {alert.text}
          </Alert>
        )}
      </div>

      <Sheet
        variant="outlined"
        className="mt-6 flex min-h-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 shadow-sm sm:h-[calc(100vh-260px)]"
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
                className="min-w-240 text-slate-700"
                sx={{
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
                  "& thead th:nth-child(2)": {
                    width: "40%",
                  },
                  "& thead th:nth-child(3)": {
                    width: "14%",
                  },
                  "& thead th": {
                    zIndex: 2,
                    backgroundColor: "rgb(248 250 252)",
                    backgroundImage: "none",
                  },
                  "& tr > *:nth-child(n+4)": { textAlign: "left" },
                }}
              >
                <thead>
                  <tr className="text-slate-600">
                    <th className="px-6 py-4">{t("storage-name")}</th>
                    <th className="px-6 py-4">{t("description")}</th>
                    <th className="px-6 py-4">{t("created-at")}</th>
                    <th className="px-6 py-4">{t("updated-at")}</th>
                    <th className="px-6 py-4 text-right"></th>
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
