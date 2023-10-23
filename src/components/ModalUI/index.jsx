import React, { useRef, useState } from "react";
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
  modalWidth,
  full,
  children,
  isView,
  bottomModal,
}) {
  const { t } = useTranslation();
  const [_isChanged, setIsChanged] = useState(false);
  const isViewed = useRef(false);

  const parent = isForm
    ? (children) => (
        <div>
          <FormValidation
            button
            className={[styles.content, full ? styles.full : ""].join(" ")}
            onSubmit={onSubmit}
            isChanged={_isChanged}
            style={modalWidth ? { width: modalWidth } : {}}
            onChanged={(data) => {
              if (!isViewed.current) {
                isViewed.current = true;
                return;
              }
              let isChanged = false;
              if (Object.keys(data)?.length > 0) {
                if (!Object.values(data).find((d) => d)) isChanged = false;
                else isChanged = true;
              }

              setIsChanged(isChanged);
              onChanged && onChanged(isChanged, data);
            }}
          >
            {(onSubmit) => children(onSubmit, _isChanged)}
          </FormValidation>
        </div>
      )
    : (children) => (
        <div
          style={modalWidth ? { width: modalWidth } : {}}
          className={[styles.content, full ? styles.full : ""].join(" ")}
        >
          {children}
        </div>
      );

  function onClose() {
    setIsChanged(false);
    isViewed.current = false;
    handleClose && handleClose();
  }

  return (
    <Modal
      className={styles.main}
      open={open}
      onClose={onClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Slide direction="up" in={open}>
        {/* <CloseRounded onClick={handleClose} className={styles.close} /> */}
        {parent((handleSubmit, isChanged) => {
          return (
            <React.Fragment>
              {children}
              {bottomModal ? (
                bottomModal(handleSubmit, handleClose, isView, isChanged)
              ) : (
                <div className={styles.row}>
                  <Button
                    onClick={isForm ? handleSubmit : onSubmit}
                    variant="contained"
                    disabled={!isChanged}
                  >
                    {t("save")}
                  </Button>
                  <Button onClick={onClose}>{t("close")}</Button>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </Slide>
    </Modal>
  );
}

export default React.memo(ModalUI, areEqual);
