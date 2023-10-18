import React from "react";
import ReactDOM from "react-dom";
import { Button, Dialog, DialogActions } from "@mui/material";

export function showYesNoDialog(message, onYes, onNo, t = (c) => c) {
  const handleClose = () => {
    ReactDOM.unmountComponentAtNode(container);
  };

  const handleYes = () => {
    if (onYes) onYes();
    handleClose();
  };

  const handleNo = () => {
    if (onNo) onNo();
    handleClose();
  };

  const container = document.createElement("div");
  document.body.appendChild(container);

  const dialog = (
    <Dialog open={true} onClose={handleClose}>
      <div style={{ padding: "16px" }}>
        <p style={{ fontSize: "var(--input-font-size)" }}>{message}</p>
      </div>
      <DialogActions>
        <Button onClick={handleNo} color="primary">
          {t(onYes ? "no" : "close")}
        </Button>
        {onYes && (
          <Button onClick={handleYes} color="primary">
            {t("yes")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  ReactDOM.render(dialog, container);
}
