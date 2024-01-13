import React from "react";
import styles from "./group.module.scss";

export default function Group({ children, showAllBorder, title }) {
  return (
    <fieldset
      className={[!showAllBorder ? styles.hide : "", styles.container].join(" ")}
    >
      {title && <legend className={styles.title}>{title}</legend>}
      <div className={styles.content}>{children}</div>
    </fieldset>
  );
}
