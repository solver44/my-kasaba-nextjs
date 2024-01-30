import React from "react";
import { useSelector } from "react-redux";
import styles from "../labor.module.scss";
import DocumentViewer from "@/components/DocumentViewer";

export default function LaborAttestationReport({ data }) {
  const { bkutData = {} } = useSelector((states) => states);

  return (
    <div className={styles.form}>
      <DocumentViewer
        documentSrc="/reports/labor-attestation.docx"
        ignoreWidth
        generateData={data}
        fileName={bkutData.name +  " (Ish o'rni attestatsiyasi)"}
      />
    </div>
  );
}
