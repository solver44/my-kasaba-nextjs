import React from "react";
import styles from "./VerticalStepper.module.scss";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LoadingButton } from "@mui/lab";

export default function VerticalStepper({
  steps = [],
  validation,
  loading,
  onFinish,
}) {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      {steps.map((step, i) => (
        <div key={i} className={styles.block}>
          <h2 className={styles.title}>{step.label}</h2>
          <div className={styles.content}>{step.children}</div>
        </div>
      ))}
      <LoadingButton
        loading={loading}
        variant="contained"
        className={styles.button}
        type={validation ? "submit" : "button"}
        onClick={validation ? null : onFinish}
      >
        {t("sent")}
      </LoadingButton>
    </div>
  );
}
