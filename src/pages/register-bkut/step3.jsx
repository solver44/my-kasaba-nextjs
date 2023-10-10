import React from "react";
import styles from "./registerBkut.module.scss";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/FormInput";

export default function Step3() {
  const { t } = useTranslation();
  return (
    <div className={styles.grid}>
      <div className={styles.grid_column}>
        <FormInput
          required
          name="foundingDocNum"
          label={t("founding-doc-num")}
          editable
        />
        <FormInput
          required
          name="foundingDocDate"
          date
          label={t("founding-doc-date")}
          editable
        />
      </div>
      <div className={styles.grid_column}>
        <FormInput
          required
          name="electronicFile"
          fileInput
          label={t("electronic-file")}
          editable
        />
        <FormInput
          required
          name="application"
          fileInput
          label={t("application")}
          editable
        />
      </div>
    </div>
  );
}
