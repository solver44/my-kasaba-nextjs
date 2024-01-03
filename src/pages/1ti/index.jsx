import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import { useSelector } from "react-redux";
import ChangableInput from "@/components/ChangableInput";
import styles from "./1ti.module.scss";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { getPresidentBKUT } from "@/utils/data";
import { getReportDate, getReportYear } from "@/utils/date";

export default function OneTI() {
  const { bkutData = {} } = useSelector((states) => states);
  const [currentReport, setCurrentReport] = useState({});
  const [years, setYears] = useState([]);
  const [currentYear, setYear] = useState(getReportYear());
  const [data, setData] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (!bkutData.id) return;
    const allYears = [];
    const y = getReportYear();
    (bkutData.reports || []).forEach((r) => {
      const cYear = dayjs(r.date).year();
      if (cYear == y) return;
      allYears.push({
        value: cYear,
        label: t("for-year", { year: cYear }),
        labelRu: t("for-year", { year: cYear }),
      });
    });
    allYears.push({ value: y, label: t("for-year", { year: y }) });
    setYears(allYears.reverse());
  }, [bkutData]);

  useEffect(() => {
    if (!bkutData.id) return;
    const temp = (bkutData.reports || []).find((r) => {
      const cYear = dayjs(r.date).year();
      return cYear == currentYear;
    });
    if (typeof temp === "object") temp.date = temp?.date || getReportDate();

    setCurrentReport(temp || { date: getReportDate() });
  }, [currentYear, bkutData]);

  useEffect(() => {
    if (!currentReport.date) return;

    const year = currentYear;
    const rais = getPresidentBKUT(bkutData);

    const tempJsonData = {
      CURRENTYEARS: year,
      BKUTNAME: bkutData.name,
      BKUTDIRECTOR: rais,
      PHONE: bkutData.phone,
      ISFIRED: !currentReport.isFiredFromMainJob ? "yo'q" : "ha",
      ISAPPARATUS: !currentReport?.isProvidedPaidApparatus ? "yo'q" : "ha",
      WORKERSAMOUNT: currentReport?.workersAmount || "0",
      WORKERSFEMALE: currentReport?.workersFemale || "0",
      WORKERSADULTS: currentReport?.workersAdults || "0",
      WORKERSMEMBERS: currentReport?.workersMembers || "0",
      WORKERSFEMALEMEMBERS: currentReport?.workersFemaleMembers || "0",
      WORKERSADULTSMEMBERS: currentReport?.workersAdultsMembers || "0",
      STUDENTSAMOUNT: currentReport?.studentsAmount || "0",
      STUDENTSFEMALE: currentReport?.studentsFemale || "0",
      STUDENTSADULTS: currentReport?.studentsAdults || "0",
      STUDENTSMEMBERS: currentReport?.studentsMembers || "0",
      STUDENTSFEMALEMEMBERS: currentReport?.studentsFemaleMembers || "0",
      STUDENTSADULTSMEMBERS: currentReport?.studentsAdultsMembers || "0",
      PENSIONERAMOUNT: currentReport?.pensionerAmount || "0",
      STAFFINGAMOUNT: currentReport?.staffingAmount || "0",
      STAFFINGWORKERSAMOUNT: currentReport?.staffingWorkersAmount || "0",
      STAFFINGRESPONSIBLEWORKERS:
        currentReport?.staffingResponsibleWorkers || "0",
      STAFFINGTECHNICALWORKERS: currentReport?.staffingTechnicalWorkers || "0",
    };

    setData(tempJsonData);
  }, [currentReport]);

  return (
    <div className={styles.form}>
      <div className={styles.container}>
        <div className={styles.editBtn}>
          <ChangableInput
            style={{ width: 200 }}
            hideEmpty
            value={currentYear}
            select
            dataSelect={years}
            onChange={({ target: { value } }) => setYear(value)}
          />
          <p
            className={[
              styles.titleYear,
              currentReport?.workersAmount ? "" : styles.red,
            ].join(" ")}
          >
            {currentReport?.workersAmount
              ? t("report-entered")
              : t("report-not-entered")}
          </p>
        </div>

        <DocumentViewer
          documentSrc="/report1ti.docx"
          generateData={data}
          fileName={bkutData.name + " 1ti hisoboti"}
        />
      </div>
    </div>
  );
}

OneTI.layout = function (Component, t) {
  return <HomeWrapper title={t("1ti1")}>{Component}</HomeWrapper>;
};
