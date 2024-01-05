import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./team-contracts.module.scss";
import { getFIO } from "@/utils/data";
import { Chip, Paper } from "@mui/material";
import ChangableInput from "@/components/ChangableInput";
import DocumentViewer from "@/components/DocumentViewer";
import { convertStringToFormatted } from "@/utils/date";

export default function OpinionsTab({ data, bkutData }) {
  const { commission = {}, experts = [], opinions = [], opinionFile } = data;
  const { t } = useTranslation();
  const [selectedDoc, setSelectedDoc] = useState(0);
  function handleDoc(index) {
    if (isCurrentJSH) return;
    setSelectedDoc(index);
  }
  const isCurrentJSH = data?.status === "CURRENT_JSH";

  const chipStyle = {
    fontSize: 18,
    height: "auto",
    padding: "4px 2px",
    borderRadius: 2,
  };

  const app = opinionFile || "";
  return (
    <div className="modal-col big">
      {!isCurrentJSH && (
        <Paper style={{ padding: 10 }}>
          <ChangableInput
            value={commission._instanceName}
            disabled
            label={t("team-contracts.commission")}
          />
        </Paper>
      )}
      <div className={styles.JShDocumentContainer}>
        <div className={styles.topDocs}>
          {!isCurrentJSH && (
            <Chip
              style={chipStyle}
              onClick={() => handleDoc(0)}
              clickable
              color={selectedDoc == 0 ? "primary" : "default"}
              variant="outlined"
              label={t("team-contracts.opinions")}
            />
          )}
          {app && (
            <Chip
              style={chipStyle}
              onClick={() => handleDoc(1)}
              clickable
              color={selectedDoc == 1 || isCurrentJSH ? "primary" : "default"}
              variant="outlined"
              label={t("team-contracts.opinion-file")}
            />
          )}
        </div>
        <div className={styles.viewer}>
          <DocumentViewer
            showNameFile
            url={selectedDoc || isCurrentJSH ? opinionFile : null}
            documentSrc={
              isCurrentJSH || selectedDoc ? null : "/expertize-result.docx"
            }
            generateData={
              isCurrentJSH || selectedDoc
                ? null
                : {
                    commission_president: data?.commission?.president || "",
                    contract_end_date: convertStringToFormatted(
                      data.contractEndDate
                    ),
                    parent_name: bkutData?.eLegalEntity?.name || "",
                    org_name: bkutData.name,
                    experts: experts.map((member) => ({
                      full_name: getFIO(member),
                    })),
                    rules: (opinions || [])
                      .sort((a, b) => a.number - b.number)
                      .map((opinion) => {
                        return {
                          section: opinion.section,
                          sugg:
                            opinion.suggAndObj || "Taklif va e'tirozlar yo'q",
                        };
                      }),
                  }
            }
          />
        </div>
      </div>
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
