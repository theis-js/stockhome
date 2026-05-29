import { useQuery } from "@tanstack/react-query";
import { getStorages } from "../utils/uxFncs";
import { Sheet, Table, Button, CircularProgress, Typography } from "@mui/joy";
import { useTranslation } from "react-i18next";
import type { Storage } from "../misc/interfaces";
import { StorageRow } from "../components/StorageRow";
import { useState } from "react";
import { AddStorageModal } from "../components/modals/AddStorageModal";

export const Storages = () => {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);

  const { data: storages, isLoading } = useQuery({
    queryKey: ["storages"],
    queryFn: () => getStorages(),
  });

  return (
    <Sheet>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <>
          <AddStorageModal isOpen={modal} setOpen={setModal} />
          <Button onClick={() => setModal(true)}>+</Button>
          <Typography level="body-md" color="warning" fontWeight={"bold"}>
            {t("storage-delete-info")}
          </Typography>
          <Table
            borderAxis="x"
            color="neutral"
            stickyHeader
            stripe="odd"
            variant="soft"
          >
            <thead>
              <tr>
                <th>{t("name")}</th>
                <th>{t("description")}</th>
                <th>{t("created-at")}</th>
                <th>{t("updated-at")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {storages?.map((storage: Storage) => (
                <StorageRow key={storage.uuid} storage={storage} />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Sheet>
  );
};
