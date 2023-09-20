import React from "react";
import styles from "./loader.module.scss";

export default function Loader() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.ring}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}
