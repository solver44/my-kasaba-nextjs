import React, { useRef, useState } from "react";
import styles from "./modal.module.scss";
import Modal from "@mui/material/Modal";
import { Button, IconButton, Slide } from "@mui/material";
// import { CloseRounded } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import FormValidation from "../FormValidation";
import areEqual from "@/utils/areEqual";
import { CloseOutlined } from "@mui/icons-material";

function ModalUI({
  open,
  onSubmit,
  onChanged,
  isForm,
  handleClose,
  dataModal,
  modalWidth,
  loading,
  title,
  full,
  children,
  hideBtn = false,
  isView,
  bottomModal,
  wrapperClass = "",
}) {
  const { t } = useTranslation();
  const [_isChanged, setIsChanged] = useState(false);

  const parent = isForm
    ? (children) => (
        <div>
          <FormValidation
            button
            className={[styles.content, full ? styles.full : ""].join(" ")}
            onSubmit={onSubmit}
            loading={loading}
            isChanged={_isChanged}
            style={modalWidth ? { width: modalWidth } : {}}
            onChanged={(currentData, oldData) => {
              let isChanged = !areEqual(oldData, currentData);

              setIsChanged(isChanged);
              onChanged && onChanged(isChanged, currentData);
            }}
          >
            {(onSubmit, data) => children(onSubmit, _isChanged, data)}
          </FormValidation>
        </div>
      )
    : (children) => (
        <div
          loading={loading}
          style={modalWidth ? { width: modalWidth } : {}}
          className={[styles.content, full ? styles.full : ""].join(" ")}
        >
          {children(onSubmit)}
        </div>
      );

  function onClose() {
    setIsChanged(false);
    // currentData.current = undefined;
    handleClose && handleClose();
  }

  return (
    <Modal
      className={styles.main}
      open={open}
      // onClose={onClose}
      // aria-labelledby="modal-modal-title"
      // aria-describedby="modal-modal-description"
    >
      <Slide direction="up" in={open}>
        {/* <CloseRounded onClick={handleClose} className={styles.close} /> */}
        {parent((handleSubmit, isChanged, currentData) => {
          return (
            <React.Fragment>
              <div className={styles.top}>
                <h2 className={styles.title}>{title}</h2>
                <IconButton onClick={onClose}>
                  <CloseOutlined />
                </IconButton>
              </div>
              <div className={[styles.wrapper, wrapperClass].join(" ")}>
                {children}
              </div>
              {bottomModal ? (
                <div className={styles.bottom}>
                  {bottomModal(
                    handleSubmit,
                    onClose,
                    isView,
                    isChanged,
                    currentData,
                    dataModal
                  )}
                </div>
              ) : (
                <div className={[styles.bottom, styles.row].join(" ")}>
                  {hideBtn === false ? (
                    <Button
                      onClick={isForm ? handleSubmit : onSubmit}
                      variant="contained"
                      disabled={!isChanged}
                    >
                      {t("save")}
                    </Button>
                  ) : null}
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
