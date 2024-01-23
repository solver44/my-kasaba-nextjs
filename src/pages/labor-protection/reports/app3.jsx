import useActions from "@/hooks/useActions";
import HomeWrapper from "@/pages/home/wrapper";
import { getReportDate, getReportYear } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styles from "../labor.module.scss";
import ChangableInput from "@/components/ChangableInput";
import DocumentViewer from "@/components/DocumentViewer";

export default function LaborApp3Report({ data }) {
  const { bkutData = {} } = useSelector((states) => states);

  return (
    <div className={styles.form}>
      <DocumentViewer
        documentSrc="/reports/labor-app3.docx"
        generateData={data}
        fileName={bkutData.name + " 3-ilova hisoboti"}
      />
    </div>
  );
}
