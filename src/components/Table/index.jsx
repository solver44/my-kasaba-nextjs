import React from "react";
import styles from "./table.module.scss";
import { useTranslation } from "react-i18next";

export default function Table({ topComponent, data = [] }) {
  const { t } = useTranslation();
  return (
    <div className={styles.wrapper}>
      {topComponent}
      <div className={styles.container}>
        {data.map((options, index) => (
          <div
            key={index}
            className={[
              styles.row,
              (index + 1) % 2 === 0 ? styles.even : "",
            ].join(" ")}
          >
            <span>{t(options.title)}:</span>
            <span>{options.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
