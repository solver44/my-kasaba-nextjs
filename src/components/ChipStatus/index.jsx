import React from "react";
import styles from "./chipStatus.module.scss";
import { Chip } from "@mui/material";
import { getStatusColors } from "@/utils/data";
import { t } from "i18next";

export default function ChipStatus({
  label,
  colorValue,
  color,
  value,
  isText,
  isSidebar,
}) {
  const colorChip = color ?? getStatusColors(colorValue);
  return (
    <div className={[styles.wrapper, isSidebar ? styles.full : ""].join(" ")}>
      <p className={styles.label}>{label}</p>
      {isText ? (
        <p className={styles.value}>{value}</p>
      ) : (
        <Chip
          className={styles.chip}
          label={value}
          variant="outlined"
          color={colorChip}
        />
      )}
    </div>
  );
}
