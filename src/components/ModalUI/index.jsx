import React from "react";
import styles from "./modal.module.scss";
import Modal from "@mui/material/Modal";
import { Button, Slide } from "@mui/material";
// import { CloseRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FormValidation from "../FormValidation";
import areEqual from "@/utils/areEqual";

function ModalUI({
  open,
  onSubmit,
  onChanged,
  isForm,
  handleClose,
  full,
  children,
  isView,
  bottomModal,
}) {
  const { t } = useTranslation();
  const parent = isForm
    ? (children) => (
        <div>
          <FormValidation
            button
            className={[styles.content, full ? styles.full : ""].join(" ")}
            onSubmit={onSubmit}
            onChanged={onChanged}
          >
            {(onSubmit) => children(onSubmit)}
          </FormValidation>
        </div>
      )
    : (children) => (
        <div className={[styles.content, full ? styles.full : ""].join(" ")}>
          {children}
        </div>
      );

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
        {parent((handleSubmit) => (
          <React.Fragment>
            {children}
            {bottomModal ? (
              bottomModal(handleSubmit, handleClose, isView)
            ) : (
              <div className={styles.row}>
                <Button
                  onClick={isForm ? handleSubmit : onSubmit}
                  variant="contained"
                >
                  {t("save")}
                </Button>
                <Button onClick={handleClose}>{t("close")}</Button>
              </div>
            )}
          </React.Fragment>
        ))}
      </Slide>
    </Modal>
  );
}

export default React.memo(ModalUI, areEqual);
