import React from "react";
import { useSelector } from "react-redux";
import styles from "../labor.module.scss";
import DocumentViewer from "@/components/DocumentViewer";

export default function LaborJSHReport({ data }) {
  const { bkutData = {} } = useSelector((states) => states);

  return (
    <div className={styles.jsh}>
      <DocumentViewer
        documentSrc="/reports/labor-jsh.docx"
        ignoreWidth
        generateData={data}
        fileName={bkutData.name +  " (JSH bandlari)"}
      />
    </div>
  );
}
