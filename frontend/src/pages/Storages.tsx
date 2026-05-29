import { useQuery } from "@tanstack/react-query";
import { getStorages } from "../utils/uxFncs";
import { Sheet, Table, Button, CircularProgress, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import type { Storage } from "../misc/interfaces";
import { StorageRow } from "../components/StorageRow";
import { useState } from "react";
import { AddStorageModal } from "../components/modals/AddStorageModal";
import AddIcon from "@mui/icons-material/Add";

export const Storages = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);

  const { data: storages, isLoading } = useQuery({
    queryKey: ["storages"],
    queryFn: () => getStorages(),
  });

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
      </div>

      <Sheet className="mt-6 rounded-3xl border border-slate-200/70 bg-white/90 p-6 shadow-[0_24px_60px_rgba(12,38,78,0.12)] backdrop-blur">
        <AddStorageModal isOpen={modal} setOpen={setModal} />
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <CircularProgress size="lg" />
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white">
            <Table hoverRow className="min-w-240 text-slate-700">
              <thead className="bg-slate-50/80 text-slate-500">
                <tr className="text-sm uppercase tracking-wide">
                  <th className="px-5 py-3 text-left">{t("storage-name")}</th>
                  <th className="px-5 py-3 text-left">{t("description")}</th>
                  <th className="px-5 py-3 text-left">{t("created-at")}</th>
                  <th className="px-5 py-3 text-left">{t("updated-at")}</th>
                  <th className="px-5 py-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {storages?.map((storage: Storage) => (
                  <StorageRow key={storage.uuid} storage={storage} />
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Sheet>
    </>
  );
};
