import useActions from "@/hooks/useActions";
import HomeWrapper from "@/pages/home/wrapper";
import { getReportDate, getReportYear } from "@/utils/date";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import styles from "../labor.module.scss";
import ChangableInput from "@/components/ChangableInput";
import DocumentViewer from "@/components/DocumentViewer";

export default function LaborApp3Page() {
  const { bkutData = {} } = useSelector((states) => states);
  const [currentReport, setCurrentReport] = useState({});
  const [years, setYears] = useState([]);
  const [currentYear, setYear] = useState(getReportYear());
  const [data, setData] = useState({});
  const { t } = useTranslation();
  const actions = useActions();

  useEffect(() => {
    if (!bkutData.id) return;
    const allYears = [];
    const y = getReportYear();
    // (bkutData.reports || []).forEach((r) => {
    //   const cYear = r.year;
    //   if (cYear == y) return;
    //   allYears.push({
    //     value: cYear,
    //     label: t("for-year", { year: cYear }),
    //     labelRu: t("for-year", { year: cYear }),
    //   });
    // });
    allYears.push({ value: y, label: t("for-year", { year: y }) });
    setYears(allYears.reverse());
  }, [bkutData]);

  useEffect(() => {
    if (!bkutData.id) return;
    const temp = null;
    // const temp = (bkutData.reports || []).find((r) => {
    //   const cYear = r.year;
    //   return cYear == currentYear;
    // });
    // if (typeof temp === "object") temp.date = temp?.date || getReportDate();

    setCurrentReport(temp || { year: getReportYear(), date: getReportDate() });
  }, [currentYear, bkutData]);

  useEffect(() => {
    async function initData() {
      try {
        if (!currentReport.year) return;
        actions.showLoading(true);
        // if (!data.data) return;
        // data =
        //   typeof data.data === "string" ? JSON.parse(data.data) : data.data;

        const tempJsonData = {
          
        };

        setData(tempJsonData);
      } catch (error) {
        console.error(error);
      } finally {
        actions.showLoading(false);
      }
    }
    initData();
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
          documentSrc="/reports/labor-app3.docx"
          generateData={data}
          fileName={bkutData.name + " 3-ilova hisoboti"}
        />
      </div>
    </div>
  );
}

LaborApp3Page.layout = function (Component, t) {
  return <HomeWrapper title={t("labor.app3")}>{Component}</HomeWrapper>;
};
