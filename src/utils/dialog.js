import React from "react";
import ReactDOM from "react-dom";
import { Button, Dialog, DialogActions } from "@mui/material";
import { CheckCircleOutline, InfoOutlined } from "@mui/icons-material";

export function showYesNoDialog(
  message,
  onYes,
  onNo,
  t = (c) => c,
  yesText,
  noText
) {
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
      <div
        style={{
          padding: "16px",
          display: "flex",
          gap: 15,
          paddingTop: 30,
          alignItems: "flex-start",
        }}
      >
        <InfoOutlined style={{ fontSize: 40, color: "#2195d6" }} />
        <p style={{ fontSize: "var(--input-font-size)", marginTop: 0 }}>
          {message}
        </p>
      </div>
      <DialogActions>
        <Button onClick={handleNo} color="primary">
          {t(noText ?? (onYes ? "no" : "close"))}
        </Button>
        {onYes && (
          <Button onClick={handleYes} color="primary">
            {t(yesText ?? "yes")}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  ReactDOM.render(dialog, container);
}
