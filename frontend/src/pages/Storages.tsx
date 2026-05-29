import { useQuery } from "@tanstack/react-query";
import { getStorages } from "../utils/uxFncs";
import { Sheet, Table, Button, CircularProgress, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import type { Storage } from "../misc/interfaces";
import { StorageRow } from "../components/StorageRow";
import { useState } from "react";
import { AddStorageModal } from "../components/modals/AddStorageModal";
import AddBoxIcon from "@mui/icons-material/AddBox";

export const Storages = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);

  const { data: storages, isLoading } = useQuery({
    queryKey: ["storages"],
    queryFn: () => getStorages(),
  });

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="space-y-1">
            <Typography level="h2" className="text-slate-900">
              {t("storages")}
            </Typography>
            <Typography level="body-lg" className="text-slate-500">
              {t("storage-delete-info")}
            </Typography>
          </div>
          <Button
            onClick={() => setModal(true)}
            size="lg"
            startDecorator={<AddBoxIcon />}
            className="ml-auto rounded-2xl bg-[#0b6bcb] px-5 text-white shadow-[0_16px_36px_rgba(11,107,203,0.35)] transition hover:-translate-y-0.5 hover:bg-[#095aa7]"
          >
            {t("add")}
          </Button>
        </div>
      </div>

      <Sheet className="mt-6 rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_24px_60px_rgba(12,38,78,0.12)] backdrop-blur">
        <AddStorageModal isOpen={modal} setOpen={setModal} />
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress size="lg" />
          </div>
        ) : (
          <Table
            hoverRow
            className="min-w-240 text-slate-700"
            sx={{
              "--TableCell-headBackground": "transparent",
              "& thead th": {
                fontWeight: "lg",
                color: "#475569",
                padding: "16px 20px",
              },
              "& tbody td": {
                padding: "18px 20px",
              },
              "& tbody tr": {
                borderTop: "1px solid #e2e8f0",
              },
            }}
          >
            <thead>
              <tr>
                <th>{t("name")}</th>
                <th>{t("description")}</th>
                <th>{t("created-at")}</th>
                <th>{t("updated-at")}</th>
                <th className="text-right"></th>
              </tr>
            </thead>
            <tbody>
              {storages?.map((storage: Storage) => (
                <StorageRow key={storage.uuid} storage={storage} />
              ))}
            </tbody>
          </Table>
        )}
      </Sheet>
    </>
  );
};
