import React from "react";
import styles from "./reglament.module.scss";
import { useTranslation } from "react-i18next";

export default function Reglament({
  title,
  message,
  buttonText,
  onClick = () => {},
}) {
  const { t } = useTranslation();
  
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>{t(title)}</p>
      <p
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: t(message) }}
      ></p>

      {buttonText && (
        <button onClick={onClick} className={"primary-btn " + styles.button}>
          {t(buttonText)}
        </button>
      )}
    </div>
  );
}
