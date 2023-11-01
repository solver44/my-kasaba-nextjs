import { Dialog, Grow } from "@mui/material";
import React from "react";
import styles from "./dialog.module.scss";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Grow direction="up" ref={ref} {...props} />;
});

export default function SimpleDialog({ onClose, open, children }) {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <Dialog TransitionComponent={Transition} onClose={handleClose} open={open}>
      <div className={styles.container}>{children}</div>
    </Dialog>
  );
}
