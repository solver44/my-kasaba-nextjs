import React from "react";
import styles from "./registerBkut.module.scss";
import { useTranslation } from "react-i18next";
import ChangableInput from "../../components/ChangableInput";

export default function Step3() {
  const { t } = useTranslation();
  return (
    <div className={styles.grid}>
      <div className={styles.grid_column}>
        <ChangableInput label={t("founding-doc-num")} editable />
        <ChangableInput label={t("founding-doc-date")} editable />
        <ChangableInput label={t("electronic-file")} editable />
        <ChangableInput label={t("application")} editable />
      </div>
    </div>
  );
}
