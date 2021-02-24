import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@material-ui/core";
import React from "react";

interface Idialog {
    isOpen: boolean;
    title: string;
    subTitle: string;
    onConfirm(): void;
  }
  
interface Props {
    confirmDialog: Idialog,
    setConfirmDialog: React.Dispatch<React.SetStateAction<Idialog>>
}

const DeleteConfirmation: React.FC<Props> = ({confirmDialog, setConfirmDialog}) => {
  return (
    <div>
      <Dialog
        open={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {confirmDialog.subTitle}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={confirmDialog.onConfirm}>
            Yes
          </Button>
          <Button
            color="primary"
            onClick={() =>
              setConfirmDialog({ ...confirmDialog, isOpen: false })
            }
          >
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DeleteConfirmation;
