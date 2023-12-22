import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import { useSelector } from "react-redux";
import ChangableInput from "@/components/ChangableInput";
import styles from "./1ti.module.scss";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { getPresidentBKUT } from "@/utils/data";

export default function OneTI() {
  const { bkutData = {} } = useSelector((states) => states);
  const [currentReport, setCurrentReport] = useState({});
  const [years, setYears] = useState([]);
  const [currentYear, setYear] = useState(dayjs().year());
  const [data, setData] = useState({});
  const { t } = useTranslation();

  useEffect(() => {
    if (!bkutData.id) return;
    const allYears = [];
    const y = dayjs().year();
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
    setCurrentReport(temp || { date: dayjs().format("YYYY-MM-DD") });
    if (!temp?.workersAmount && !editMode) setEditMode(true);
  }, [currentYear, bkutData]);

  useEffect(() => {
    if (!currentReport.id) return;

    const year = currentYear;
    const rais = getPresidentBKUT(bkutData);

    const tempJsonData = {
      CURRENTYEARS: year.toString(),
      BKUTNAME: bkutData.name,
      BKUTDIRECTOR: rais,
      PHONE: bkutData.phone,
      ISFIRED: !currentReport.isFiredFromMainJob ? "yo'q" : "ha",
      ISAPPARATUS: !currentReport?.isProvidedPaidApparatus ? "yo'q" : "ha",
      WORKERSAMOUNT: currentReport?.workersAmount?.toString(),
      WORKERSFEMALE: currentReport?.workersFemale?.toString(),
      WORKERSADULTS: currentReport?.workersAdults?.toString(),
      WORKERSMEMBERS: currentReport?.workersMembers?.toString(),
      WORKERSFEMALEMEMBERS: currentReport?.workersFemaleMembers?.toString(),
      WORKERSADULTSMEMBERS: currentReport?.workersAdultsMembers?.toString(),
      STUDENTSAMOUNT: currentReport?.studentsAmount?.toString(),
      STUDENTSFEMALE: currentReport?.studentsFemale?.toString(),
      STUDENTSADULTS: currentReport?.studentsAdults?.toString(),
      STUDENTSMEMBERS: currentReport?.studentsMembers?.toString(),
      STUDENTSFEMALEMEMBERS: currentReport?.studentsFemaleMembers?.toString(),
      STUDENTSADULTSMEMBERS: currentReport?.studentsAdultsMembers?.toString(),
      PENSIONERAMOUNT: currentReport?.pensionerAmount?.toString(),
      STAFFINGAMOUNT: currentReport?.staffingAmount?.toString(),
      STAFFINGWORKERSAMOUNT: currentReport?.staffingWorkersAmount?.toString(),
      STAFFINGRESPONSIBLEWORKERS:
        currentReport?.staffingResponsibleWorkers?.toString(),
      STAFFINGTECHNICALWORKERS:
        currentReport?.staffingTechnicalWorkers?.toString(),
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
