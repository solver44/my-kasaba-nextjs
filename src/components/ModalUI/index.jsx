import React from "react";
import styles from "./modal.module.scss";
import Modal from "@mui/material/Modal";
import { Button, Slide } from "@mui/material";
// import { CloseRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FormValidation from "../FormValidation";

export default function ModalUI({
  open,
  onSubmit,
  isForm,
  handleClose,
  children,
}) {
  const { t } = useTranslation();
  const parent = isForm
    ? (children) => (
        <div>
          <FormValidation className={styles.content} onSubmit={onSubmit}>{children}</FormValidation>
        </div>
      )
    : (children) => <div className={styles.content}>{children}</div>;

  return (
    <Modal
      className={styles.main}
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Slide direction="up" in={open}>
        {/* <CloseRounded onClick={handleClose} className={styles.close} /> */}
        {parent(
          <React.Fragment>
            {children}
            <div className={styles.row}>
              <Button
                type={isForm ? "submit" : "button"}
                onClick={isForm ? null : onSubmit}
                variant="contained"
              >
                {t("save")}
              </Button>
              <Button onClick={handleClose}>{t("close")}</Button>
            </div>
          </React.Fragment>
        )}
      </Slide>
    </Modal>
  );
}
