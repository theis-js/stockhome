import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import DialogTitle from "@mui/joy/DialogTitle";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";
import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import type { Storage } from "../../misc/interfaces";
import { useTranslation } from "react-i18next";

interface DeleteConfirmationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  storage: Storage | null;
  deleteStorageByUUID: (uuid: string) => void;
}

export const DeleteConfirmation = (props: DeleteConfirmationProps) => {
  const { t } = useTranslation();

  return (
    <Modal open={props.open} onClose={() => props.setOpen(false)}>
      <ModalDialog variant="outlined" role="alertdialog">
        <DialogTitle>Confirmation</DialogTitle>
        <Divider />
        <DialogContent>
          {t("delete-confirmation-text")}
          {props.storage ? ` "${props.storage.name}"` : ""}?
        </DialogContent>
        <DialogActions>
          <Button
            variant="solid"
            color="danger"
            onClick={() => {
              if (props.storage) {
                props.deleteStorageByUUID(props.storage.uuid);
              }
              props.setOpen(false);
            }}
          >
            {t("delete")}
          </Button>
          <Button
            variant="plain"
            color="neutral"
            onClick={() => props.setOpen(false)}
          >
            {t("cancel")}
          </Button>
        </DialogActions>
      </ModalDialog>
    </Modal>
  );
};
