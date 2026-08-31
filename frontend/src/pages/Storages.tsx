import { useQuery } from "@tanstack/react-query";
import { getStorages } from "../utils/api/storages";
import { getProducts } from "../utils/api/products";
import { Button, CircularProgress, Sheet, Table, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import type { AlertInterface, Storage } from "../misc/interfaces";
import type { ApiError } from "../utils/api/apiError";
import { StorageRow } from "../components/StorageRow";
import { useEffect, useState } from "react";
import { AddStorageModal } from "../components/modals/AddStorageModal";
import { AlertTriangle, Plus } from "lucide-react";
import { MyAlert } from "../components/MyAlert.tsx";
import { PageHeader } from "../components/PageHeader.tsx";

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

  // Already cached by the sidebar/inventory query — just reused here for the count.
  const { data: products } = useQuery<{ amount?: number }[]>({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  const itemsStored = (products ?? []).reduce((sum, product) => sum + (product?.amount ?? 0), 0);

  useEffect(() => {
    if (storagesError && storagesErrorObj) {
      showError(storagesErrorObj);
    }
  }, [storagesError, storagesErrorObj]);

  return (
    <>
      <div className="flex flex-col gap-4">
        <PageHeader
          title={t("storages")}
          subtitle={t("storages-sub", { count: storages?.length ?? 0, items: itemsStored })}
          actions={
            <Button startDecorator={<Plus size={16} />} onClick={() => setModal(true)} variant="solid" className="btn-lift rounded-2xl">
              {t("new-storage")}
            </Button>
          }
        />
        <AddStorageModal isOpen={modal} setOpen={setModal} />
        <div
          className="flex items-start gap-3 rounded-2xl border border-solid px-4 py-3"
          style={{
            borderColor: "var(--joy-palette-warning-softBg)",
            backgroundColor: "var(--joy-palette-warning-softBg)",
            color: "var(--joy-palette-warning-softColor)",
          }}
        >
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <Typography level="body-lg" sx={{ color: "inherit" }}>
            {t("storage-delete-info")}
          </Typography>
        </div>
        {alert.isAlert && (
          <MyAlert type={alert.type} header={alert.header} text={alert.text} />
        )}
      </div>

      <Sheet
        variant="outlined"
        className="mt-6 flex min-h-0 w-full max-w-full flex-col overflow-hidden rounded-2xl sm:h-[calc(100vh-300px)]"
        sx={{
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.surface",
        }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress size="lg" />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <Table
              stickyHeader
              stripe="odd"
              variant="plain"
              hoverRow
              className="w-full"
              sx={{
                tableLayout: "fixed",
                color: "var(--joy-palette-text-secondary)",
                "--TableCell-headBackground": "var(--joy-palette-background-level1)",
                "& thead": {
                  position: "sticky",
                  top: 0,
                  zIndex: 3,
                  backgroundColor: "var(--joy-palette-background-level1)",
                },
                "& thead tr": {
                  backgroundColor: "var(--joy-palette-background-level1)",
                },
                "& thead th": {
                  zIndex: 2,
                  backgroundColor: "var(--joy-palette-background-level1)",
                  backgroundImage: "none",
                  color: "var(--joy-palette-text-secondary)",
                },
                "& thead th:nth-child(1)": { width: "26%", minWidth: "140px" },
                "& thead th:nth-child(2)": { width: "34%", minWidth: "160px" },
                "& thead th:nth-child(3)": { width: "16%", minWidth: "110px" },
                "& thead th:nth-child(4)": { width: "16%", minWidth: "110px" },
                "& thead th:nth-child(5)": { width: "8%", minWidth: "90px" },
                "& tr > *:nth-child(n+3)": { textAlign: "left" },
                "& tbody tr": {
                  borderTop: "1px solid var(--joy-palette-divider)",
                  transition: "background-color 120ms ease",
                },
              }}
            >
              <thead>
                <tr>
                  <th className="px-3 py-4">{t("storage-name")}</th>
                  <th className="px-3 py-4">{t("description")}</th>
                  <th className="px-3 py-4">{t("created-at")}</th>
                  <th className="px-3 py-4">{t("updated-at")}</th>
                  <th className="px-3 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody>
                {storages?.map((storage: Storage) => (
                  <StorageRow key={storage.uuid} storage={storage} onError={showError} />
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Sheet>
    </>
  );
};
