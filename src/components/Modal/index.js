import React from "react";
import { DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import { DialogContent } from "@mui/material";
import { Dialog } from "@mui/material";
import { useEffect } from "react";

const Modal = ({ isOpen, text }) => {
  const [open, setOpen] = React.useState(isOpen);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth={true}
      maxWidth="sm"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ textAlign: "center" }}
    >
      <DialogContent>{text}</DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>{"Закрыть"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Modal;
