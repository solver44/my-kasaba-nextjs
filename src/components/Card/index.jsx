import React from "react";
import Card from "@mui/material/Card";
import styles from "./card.module.scss";

export default function CardUI({ children, label, value }) {
  return (
    <Card variant="outlined" className={styles.container}>
      {children ? (
        children
      ) : (
        <>
          <p className={styles.value}>{value}</p>
          <p className={styles.label}>{label}</p>
        </>
      )}
    </Card>
  );
}
