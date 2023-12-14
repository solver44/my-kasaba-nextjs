import Accordion from "@/components/Accordion";
import FormInput from "@/components/FormInput";
import React from "react";
import { useTranslation } from "react-i18next";
import styles from "./team-contracts.module.scss";
import { getFIO } from "@/utils/data";
import { Paper } from "@mui/material";
import ChangableInput from "@/components/ChangableInput";
import DocumentViewer from "@/components/DocumentViewer";
import { convertStringToFormatted } from "@/utils/date";

export default function OpinionsTab({ data, bkutData }) {
  const { commission = {}, experts = [], opinions = [] } = data;
  const { t } = useTranslation();
  console.log(data);
  return (
    <div className="modal-col big">
      <Paper style={{ padding: 10 }}>
        <ChangableInput
          value={commission._instanceName}
          disabled
          label={t("team-contracts.commission")}
        />
      </Paper>
      <DocumentViewer
        documentSrc="/expertize-result.docx"
        generateData={{
          contract_end_date: convertStringToFormatted(data.contractEndDate),
          parent_name: bkutData?.eLegalEntity?.name || "",
          org_name: bkutData.name,
          experts: experts.map((member) => ({ full_name: getFIO(member) })),
          rules: opinions
            .filter((op) => op?.suggAndObj)
            .map((opinion) => {
              return {
                section: opinion.section,
                sugg: opinion.suggAndObj,
              };
            }),
        }}
      />
      {/* <Paper style={{ padding: 10 }}>
        <Accordion
          label={t("team-contracts.expertSections")}
          data={opinions
            .filter((op) => op?.suggAndObj)
            .map((opinion) => {
              return {
                title: opinion.section,
                description: opinion.suggAndObj,
              };
            })}
        />
      </Paper>
      <Paper style={{ padding: 10 }}>
        <div className={styles.experts}>
          <label className={styles.label}>{t("team-contracts.experts")}</label>
          {experts.map((member) => {
            return (
              <p key={member.id} className={styles.expertFIO}>
                {getFIO(member)}
              </p>
            );
          })}
        </div>
      </Paper> */}
    </div>
  );
}
