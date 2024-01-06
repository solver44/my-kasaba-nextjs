import React from "react";
import styles from "./registerBkut.module.scss";
import { useTranslation } from "react-i18next";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import areEqual from "@/utils/areEqual";

function Step3({ bkutData = {}, files = {}, filesNotRequired }) {
  const { t } = useTranslation();
  return (
    <div className={styles.grid}>
      {isOrganization ? (
        <React.Fragment>
          <div className={styles.grid_column}>
            <FormInput
              required
              value={bkutData.decisionNumber}
              name="decisionNumber"
              label={t("decision-title")}
            />
            <FormInput
              required
              name="decisionDate"
              date
              maxDate={dayjs()}
              value={bkutData.decisionDate ? dayjs(bkutData.decisionDate) : ""}
              label={t("decision-date")}
            />
          </div>
          <div className={styles.grid_column}>
            <FormInput
              required={!filesNotRequired}
              name="decisionFile"
              value={files.first?.url}
              nameOfFile={files.first?.name}
              fileInput
              label={t("decision-file")}
            />
          </div>
        </React.Fragment>
      ) : (
        <React.Fragment>
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
              maxDate={dayjs()}
              value={bkutData.protocolDate ? dayjs(bkutData.protocolDate) : ""}
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
        </React.Fragment>
      )}
    </div>
  );
}

export default React.memo(Step3, areEqual);
