import React from "react";
import styles from "./registerBkut.module.scss";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";

export default function Step3({ bkutData = {}, files = {}, filesNotRequired }) {
  const { t } = useTranslation();
  return (
    <div className={styles.grid}>
      <div className={styles.grid_column}>
        <FormInput
          required
          value={bkutData.protocolNumber}
          name="foundingDocNum"
          label={t("founding-doc-num")}
        />
        <FormInput
          required
          name="foundingDocDate"
          date
          value={dayjs(bkutData.protocolDate || "")}
          label={t("founding-doc-date")}
        />
      </div>
      <div className={styles.grid_column}>
        <FormInput
          required={!filesNotRequired}
          value={files.first?.url}
          nameOfFile={files.first?.name}
          name="electronicFile"
          fileInput
          label={t("electronic-file")}
        />
        <FormInput
          required={!filesNotRequired}
          name="application"
          value={files.second?.url}
          nameOfFile={files.second?.name}
          fileInput
          label={t("application")}
        />
      </div>
    </div>
  );
}
