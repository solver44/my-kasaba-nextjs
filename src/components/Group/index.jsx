import React from "react";
import styles from "./group.module.scss";

export default function Group({ children, title }) {
  return (
    <fieldset className={styles.container}>
      {title && <legend className={styles.title}>{title}</legend>}
      <div className={styles.content}>{children}</div>
    </fieldset>
  );
}
