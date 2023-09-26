import React from "react";
import styles from "./VerticalStepper.module.scss";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function VerticalStepper({ steps = [], loading, onFinish }) {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      {steps.map((step, i) => (
        <div key={i} className={styles.block}>
          <h2 className={styles.title}>{step.label}</h2>
          <div className={styles.content}>{step.children}</div>
        </div>
      ))}
      <Button
        disabled={loading}
        variant="contained"
        className={styles.button}
        onClick={onFinish}
      >
        {t("sent")}
      </Button>
    </div>
  );
}
