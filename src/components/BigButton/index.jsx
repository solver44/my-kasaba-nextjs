import React from "react";
import styles from "./button.module.scss";

export default function BigButton({ Icon, children }) {
  return (
    <div className={styles.wrapper}>
      {Icon && <Icon htmlColor="#197BBD" />}
      {children}
    </div>
  );
}
