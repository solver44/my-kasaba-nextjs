import React from "react";
import styles from "./group.module.scss";

export default function Group({ children, title }) {
  return (
    <div className={styles.container}>
      {title && <span className={styles.title}>{title}</span>}
      {children}
    </div>
  );
}
