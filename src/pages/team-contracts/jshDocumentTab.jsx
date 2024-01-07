import { Button, Chip } from "@mui/material";
import React, { useState } from "react";
import styles from "./team-contracts.module.scss";
import { AddCircle, Check, CheckCircle } from "@mui/icons-material";
import DocumentViewer from "@/components/DocumentViewer";
import useAnimation from "@/hooks/useAnimation";
import { useTranslation } from "react-i18next";

export default function JShDocument({ data, bkutData }) {
  const { applications = [] } = data;
  const [selectedDoc, setSelectedDoc] = useState(0);
  const currentFile =
    applications?.length > 0 ? applications[selectedDoc].file : "";
  const { t } = useTranslation();

  function handleDoc(index) {
    setSelectedDoc(index);
  }
  function getStatusFile(app) {
    const type = app?.type;
    return type === "PROJECT"
      ? t("team-contracts.project")
      : t("team-contracts.confirmed");
  }

  function newAdd() {}

  return (
    <div className={styles.JShDocumentContainer}>
      <div className={styles.topDocs}>
        {applications.map((app, index) => (
          <Chip
            key={index}
            style={{
              fontSize: 18,
              height: "auto",
              padding: "4px 2px",
              borderRadius: 2,
            }}
            onClick={() => handleDoc(index)}
            clickable
            // icon={selectedDoc == index ? <CheckCircle /> : ""}
            color={selectedDoc == index ? "primary" : "default"}
            variant={"outlined"}
            label={
              <div>
                {decodeURIComponent(app.file.split("=")[1]).replaceAll(
                  "+",
                  " "
                )}
                <span
                  style={{
                    color: "rgb(124 124 124)",
                    fontSize: 16,
                  }}
                >
                  {" "}
                  ({getStatusFile(app)})
                </span>
              </div>
            }
          />
        ))}
        {/* <Chip
          style={{ fontSize: 18, height: "auto", padding: "2px 1px" }}
          onClick={() => newAdd()}
          clickable
          color="default"
          variant={"outlined"}
          label={<AddCircle />}
        /> */}
      </div>
      <div className={styles.viewer}>
        <DocumentViewer url={currentFile} />
      </div>
    </div>
  );
}
