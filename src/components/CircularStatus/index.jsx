import React from "react";
import styles from "./circularStatus.module.scss";

export default function CircularStatus({
  label,
  value,
  errorValue,
  warningValue,
}) {
  return (
    <div
      className={[
        styles.wrapper,
        warningValue >= value ? styles.warning : "",
        errorValue >= value ? styles.error : "",
      ].join(" ")}
    >
      <p className={styles.value}>{value}</p>
      <p className={styles.label}>{label}</p>
    </div>
  );
}
