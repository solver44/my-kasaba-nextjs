import ChangableInput from "@/components/ChangableInput";
import FormInput from "@/components/FormInput";
import FormValidation from "@/components/FormValidation";
import HomeWrapper from "@/pages/home/wrapper";
import { Close, Edit } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import styles from "./labor.module.scss";
import { checkQuarter, getCurrentQuarter, getReportDate } from "@/utils/date";
import Group from "@/components/Group";
import dayjs from "dayjs";
import { QUARTERS } from ".";
import ArticleIcon from "@mui/icons-material/Article";
import FinderPINFL from "@/components/FinderPINFL";
import {
  getFIO,
  getLastPosition,
  getLocalizationNames,
  getSummarize,
} from "@/utils/data";
import LaborApp4Report from "./reports/app4";
import LaborJSHReport from "./reports/jsh";
import LaborMedicalReport from "./reports/medical";

export default function LaborMedicalPage({
  saveReport,
  bkutData,
  data = [],
  years = [],
}) {
  const { t } = useTranslation();
  const [currentReport, setCurrentReport] = useState({});
  const [quarter, setQuarter] = useState(2);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [values, setValues] = useState({});
  const [currentYear, setYear] = useState(dayjs().year());
  const [isReport, setIsReport] = useState(false);
  const [reportData, setReportData] = useState({});

  const quarters = QUARTERS(2);

  function initQuarter(value) {
    const qr = getCurrentQuarter(value, 2);
    // if (qr === false) setEditMode(false);
    // else setEditMode(true);
    setQuarter(qr || 2);
  }

  useEffect(() => {
    initQuarter();
  }, []);

  useEffect(() => {
    if (!data) return;
    const temp = data.find((r) => {
      const cYear = r.year;
      return cYear == currentYear;
    });
    setCurrentReport(
      temp || { year: currentYear, date: getReportDate(null, currentYear) }
    );
  }, [currentYear, data]);

  function getQuarter(qr) {
    const res =
      qr == "1"
        ? "I"
        : qr == "2"
        ? "1-iyul"
        : qr == "3"
        ? "III"
        : qr == "4"
        ? "1-yanvar"
        : "";
    return "\n" + res;
  }

  function getValues(st, quarter, year, suffix = "") {
    const values = {
      ["determinedOrg" + suffix]: st.determinedOrg || 0,
      ["drawnOrg" + suffix]: st.drawnOrg || 0,
      ["agreedCount" + suffix]: st.agreedCount || 0,
      ["calendarPlan" + suffix]: st.calendarPlan || 0,
      ["presented" + suffix]: st.presented || 0,
      ["examinedEmp" + suffix]: st.examinedEmp || 0,
      ["under18" + suffix]: st.under18 || 0,
      ["over50" + suffix]: st.over50 || 0,
      ["disabledEmp" + suffix]: st.disabledEmp || 0,
      ["nightJobs" + suffix]: st.nightJobs || 0,
      ["otherJobs" + suffix]: st.otherJobs || 0,
      ["educationJobs" + suffix]: st.educationJobs || 0,
      ["totalSpent" + suffix]: st.totalSpent || 0,
      ["spentPerEmp" + suffix]: st.spentPerEmp || 0,
    };
    if (quarter)
      values["date" + suffix] =
        (year ?? currentYear) + " y." + getQuarter(quarter);
    return values;
  }

  let st =
    (currentReport?.medical || []).find((a) => a.quarter == quarter) || {};
  let stAll = getSummarize(
    "medical",
    (a) => a.quarter < quarter,
    currentReport,
    quarter
  );
  useEffect(() => {
    if (isReport) {
      st = getSummarize("medical", null, currentReport, quarter);
    }

    setValues(getValues(st));

    if (isReport) {
      const oldReport = data.find((r) => r.year == currentYear - 1);
      let oldYear = getSummarize("medical", null, oldReport, quarter);
      oldYear = getValues(oldYear, quarter, currentYear - 1);
      const currValue = getValues(st, quarter, null, "2");
      const temp = {
        year: currentYear,
        ...oldYear,
        ...currValue,
      };
      setReportData(temp);
    }
  }, [currentReport, quarter, currentYear, isReport]);

  const handleSubmit = async (forms, oldForms) => {
    setLoadingEditMode(true);
    currentReport.quarter = quarter;
    
    const result = await saveReport(forms, currentReport, "medical");
    setLoadingEditMode(false);
  };

  return (
    <FormValidation className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.editBtn}>
        <ChangableInput
          style={{ width: 150 }}
          hideEmpty
          value={currentYear}
          select
          dataSelect={years}
          onChange={({ target: { value } }) => {
            initQuarter(value);
            setYear(value);
          }}
        />
        <ChangableInput
          style={{ width: 200 }}
          hideEmpty
          value={quarter}
          select
          dataSelect={quarters}
          onChange={({ target: { value } }) => {
            // setEditMode(checkQuarter(value, 2));
            setQuarter(value);
          }}
        />
        {!isReport && editMode  && (
          <LoadingButton
            variant="contained"
            type="submit"
            // disabled={!isChanged}
            startIcon={<Edit />}
            loading={loadingEditMode}
          >
            {t("save")}
          </LoadingButton>
        )}
        <p
          className={[
            styles.titleYear,
            st.id ? "" : styles.red,
          ].join(" ")}
        >
          {st.id ? t("report-entered") : t("report-not-entered")}
        </p>

        <Button
          onClick={() => setIsReport((s) => !s)}
          className={styles.articleBtn}
          variant="outlined"
          startIcon={isReport ? <Close /> : <ArticleIcon />}
        >
          {t(isReport ? "labor.formBtn" : "labor.reportBtn")}
        </Button>
      </div>
      {isReport ? (
        <div className={styles.reportContent}>
          <LaborMedicalReport data={reportData} />
        </div>
      ) : (
        <div style={{ marginTop: 20 }} className="modal-content">
          <FormInput name="id" hidden value={st?.id} />
          <FormInput
            name="determinedOrg"
            required
            suffixPlusInput={stAll}
            type="number"
            value={values.determinedOrg}
            label={t("labor.determinedOrg")}
          />
          <FormInput
            name="drawnOrg"
            required
            suffixPlusInput={stAll}
            type="number"
            value={values.drawnOrg}
            label={t("labor.drawnOrg")}
          />
          <div className="modal-row">
            <FormInput
              name="agreedCount"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.agreedCount}
              label={t("labor.agreedCount")}
            />
            <FormInput
              name="calendarPlan"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.calendarPlan}
              label={t("labor.calendarPlan")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="presented"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.presented}
              label={t("labor.presented")}
            />
            <FormInput
              name="examinedEmp"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.examinedEmp}
              label={t("labor.examinedEmp")}
            />
          </div>
          <Group showAllBorder title={t("labor.including")}>
            <div datatype="list">
              <div className="modal-row">
                <FormInput
                  name="under18"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.under18}
                  label={t("labor.under18")}
                />
                <FormInput
                  name="over50"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.over50}
                  label={t("labor.over50")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="disabledEmp"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.disabledEmp}
                  label={t("labor.disabledEmp")}
                />
                <FormInput
                  name="nightJobs"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.nightJobs}
                  label={t("labor.nightJobs")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="otherJobs"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.otherJobs}
                  label={t("labor.otherJobs")}
                />
                <FormInput
                  name="educationJobs"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.educationJobs}
                  label={t("labor.educationJobs")}
                />
              </div>
            </div>
          </Group>
          <div className="modal-row">
            <FormInput
              name="totalSpent"
              required
              suffixPlusInput={stAll}
              type="currency"
              value={values.totalSpent}
              label={t("labor.totalSpent")}
            />
            <FormInput
              name="spentPerEmp"
              maxInput="totalSpent"
              required
              suffixPlusInput={stAll}
              type="currency"
              value={values.spentPerEmp}
              label={t("labor.spentPerEmp")}
            />
          </div>
        </div>
      )}
    </FormValidation>
  );
}
LaborMedicalPage.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
