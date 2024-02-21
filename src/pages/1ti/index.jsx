import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import { useSelector } from "react-redux";
import ChangableInput from "@/components/ChangableInput";
import styles from "./1ti.module.scss";
import { useTranslation } from "react-i18next";
import { getReportDate, getReportYear, getYearFrom } from "@/utils/date";
import { getReport1ti } from "@/http/reports";
import useActions from "@/hooks/useActions";
import { Alert } from "@mui/material";

export default function OneTI() {
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
    const prevY = y - 1;
    (bkutData.reports || []).forEach((r) => {
      const cYear = r.year;
      if (cYear == y || cYear == prevY) return;
      allYears.push({
        value: cYear,
        label: t("for-year", { year: cYear }),
        labelRu: t("for-year", { year: cYear }),
      });
    });
    allYears.push({ value: prevY, label: t("for-year", { year: prevY }) });
    allYears.push({ value: y, label: t("for-year", { year: y }) });
    setYears(allYears.sort((a, b) => b.value - a.value));
  }, [bkutData]);

  useEffect(() => {
    if (!bkutData.id) return;
    const temp = (bkutData.reports || []).find((r) => {
      const cYear = r.year;
      return cYear == currentYear;
    });
    if (typeof temp === "object") temp.date = temp?.date || getReportDate();

    setCurrentReport(temp || { year: getReportYear(), date: getReportDate() });
  }, [currentYear, bkutData]);

  useEffect(() => {
    async function initData() {
      try {
        if (!currentReport.year) return;
        actions.showLoading(true);

        let data = await getReport1ti(bkutData.id, currentReport.year);
        if (!data.data) return;
        data =
          typeof data.data === "string" ? JSON.parse(data.data) : data.data;

        const tempJsonData = {
          CURRENTYEARS: data.currentYear,
          BKUTNAME: data.name,
          BKUTDIRECTOR: data.president,
          PHONE: data.phone,
          ISFIRED: data.raisOzod,
          ISAPPARATUS: data.haqApparati,
          WORKERSAMOUNT: data.leEmpAll,
          WORKERSFEMALE: data.leEmpFemale,
          WORKERSADULTS: data.leEmpAge30,
          WORKERSMEMBERS: data.memberEmpAll,
          WORKERSFEMALEMEMBERS: data.memberEmpFemale,
          WORKERSADULTSMEMBERS: data.memberEmpAge30,
          STUDENTSAMOUNT: data.studentAll,
          STUDENTSFEMALE: data.studentFemale,
          STUDENTSADULTS: data.studentAge30,
          STUDENTSMEMBERS: data.memberStudentAll,
          STUDENTSFEMALEMEMBERS: data.memberStudentFemale,
          STUDENTSADULTSMEMBERS: data.memberStudentAge30,
          PENSIONERAMOUNT: data.memberPensioner,
          STAFFINGAMOUNT: data.kuShtat,
          STAFFINGWORKERSAMOUNT: data.kuEmp,
          STAFFINGRESPONSIBLEWORKERS: data.kuMasul,
          STAFFINGTECHNICALWORKERS: data.kuTechnik,
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
          {currentReport.workersAmountOrg && (
            <Alert severity="info" className={styles.alert}>
              <span
                dangerouslySetInnerHTML={{
                  __html: t("workersOrg", {
                    value1: currentReport.workersAmountOrg,
                    value2: currentReport.workersFemaleOrg,
                  }),
                }}
              ></span>
            </Alert>
          )}
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
