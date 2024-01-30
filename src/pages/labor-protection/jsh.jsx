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
import { checkQuarter, getCurrentQuarter } from "@/utils/date";
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

export default function LaborJSHPage({
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
    if (qr === false) setEditMode(false);
    else setEditMode(true);
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
      temp || { year: dayjs().year(), date: dayjs().format("YYYY-MM-DD") }
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

  function getValues(st, stApp3, quarter, year, suffix = "") {
    const values = {
      ["medicalExaminationsSpent" + suffix]: st.medicalExaminationsSpent || 0,
      ["professionalDevelopmentSpent" + suffix]:
        st.professionalDevelopmentSpent || 0,
      ["attestationSpent" + suffix]: st.attestationSpent || 0,
      ["insuranceSpent" + suffix]: st.insuranceSpent || 0,
      ["compensationSpent" + suffix]: st.compensationSpent || 0,
      ["compensationSpent1" + suffix]: st.compensationSpent1 || 0,
      ["establishmentSpent" + suffix]: st.establishmentSpent || 0,
      ["spentOnEach" + suffix]: st.spentOnEach || 0,
      ["numberOfPerformed" + suffix]: st.numberOfPerformed || 0,
      ["representatives" + suffix]: st.representatives || 0,
      ["promotions" + suffix]: st.promotions || 0,
      ["includings" + suffix]:
        (stApp3.incudingSpentClothes || 0) +
        (stApp3.includingSpentFood || 0) +
        (stApp3.includingSpentHygiene || 0),
      ["plannedActionsSpent" + suffix]: stApp3.plannedActionsSpent || 0,
      ["performedActions" + suffix]: stApp3.performedActions || 0,
      ["plannedActions" + suffix]: stApp3.plannedActions || 0,
      ["including2Actions" + suffix]: stApp3.including2Actions || 0,
      ["including2SpentTransaction" + suffix]:
        stApp3.including2SpentTransaction || 0,
      ["electedRepresentatives" + suffix]: stApp3.electedRepresentatives || 0,
      ["electedRepresentatives1" + suffix]: stApp3.electedRepresentatives1 || 0,
      ["identifiedRepresentatives" + suffix]:
        stApp3.identifiedRepresentatives || 0,
      ["identifiedRepresentatives1" + suffix]:
        stApp3.identifiedRepresentatives1 || 0,
      ["promotions" + suffix]: stApp3.promotions || 0,
    };
    if (quarter)
      values["date" + suffix] =
        (year ?? currentYear) + " y." + getQuarter(quarter);
    return values;
  }

  let st = (currentReport?.jsh || []).find((a) => a.quarter == quarter) || {};
  let stAll = getSummarize(
    "jsh",
    (a) => a.quarter < quarter,
    currentReport,
    quarter
  );
  useEffect(() => {
    let stApp3 = getSummarize("app3", null, currentReport, quarter);
    if (isReport) {
      st = getSummarize("jsh", null, currentReport, quarter);
    }

    setValues(getValues(st, stApp3));

    if (isReport) {
      const oldReport = data.find((r) => r.year == currentYear - 1);
      let oldYear = getSummarize("jsh", null, oldReport, quarter);
      let stApp3Old = getSummarize("app3", null, oldReport, quarter);
      oldYear = getValues(oldYear, stApp3Old, quarter, currentYear - 1);
      const currValue = getValues(st, stApp3, quarter, null, "2");
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
    const result = await saveReport(forms, currentReport, "jsh");
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
            setEditMode(checkQuarter(value, 2));
            setQuarter(value);
          }}
        />
        {!isReport && editMode && currentReport?.year == dayjs().year() && (
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
            st.medicalExaminationsSpent ? "" : styles.red,
          ].join(" ")}
        >
          {st.medicalExaminationsSpent
            ? t("report-entered")
            : t("report-not-entered")}
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
          <LaborJSHReport data={reportData} />
        </div>
      ) : (
        <div style={{ marginTop: 20 }} className="modal-content">
          <FormInput name="id" hidden value={st?.id} />
          <FormInput
            name="plannedActions"
            required
            disabled
            type="number"
            value={values.plannedActions}
            label={t("labor.plannedActions")}
          />
          <div className="modal-row">
            <FormInput
              name="performedActions"
              required
              disabled
              type="number"
              value={values.performedActions}
              label={t("labor.performedActions")}
            />
            <FormInput
              name="plannedActionsSpent"
              required
              disabled
              type="number"
              value={values.plannedActionsSpent}
              label={t("labor.plannedActionsSpent")}
            />
          </div>
          <FormInput
            name="includings"
            required
            disabled
            type="number"
            value={values.includings}
            label={t("labor.includings")}
          />
          <div className="modal-row">
            <FormInput
              name="medicalExaminationsSpent"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.medicalExaminationsSpent}
              label={t("labor.medicalExaminationsSpent")}
            />
            <FormInput
              name="professionalDevelopmentSpent"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.professionalDevelopmentSpent}
              label={t("labor.professionalDevelopmentSpent")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="attestationSpent"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.attestationSpent}
              label={t("labor.attestationSpent")}
            />
            <FormInput
              name="insuranceSpent"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.insuranceSpent}
              label={t("labor.insuranceSpent")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="compensationSpent"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.compensationSpent}
              label={t("labor.compensationSpent")}
            />
            <FormInput
              name="compensationSpent1"
              maxInput="compensationSpent"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.compensationSpent1}
              label={t("labor.compensationSpent1")}
            />
          </div>
          <FormInput
            name="establishmentSpent"
            required
            suffixPlusInput={stAll}
            type="number"
            value={values.establishmentSpent}
            label={t("labor.establishmentSpent")}
          />
          <Group showAllBorder title={t("labor.jshGroup1")}>
            <div datatype="list">
              <div className="modal-row">
                <FormInput
                  name="including2Actions"
                  required
                  disabled
                  type="number"
                  value={values.including2Actions}
                  label={t("labor.jshGroup1i1")}
                />
                <FormInput
                  name="including2SpentTransaction"
                  required
                  disabled
                  type="number"
                  value={values.including2SpentTransaction}
                  label={t("labor.jshGroup1i2")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="spentOnEach"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.spentOnEach}
                  label={t("labor.spentOnEach")}
                />
                <FormInput
                  name="numberOfPerformed"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.numberOfPerformed}
                  label={t("labor.numberOfPerformed")}
                />
              </div>
            </div>
          </Group>
          <Group showAllBorder title={t("labor.jshGroup2")}>
            <div datatype="list">
              <div className="modal-row">
                <FormInput
                  name="electedRepresentatives"
                  required
                  disabled
                  type="number"
                  value={values.electedRepresentatives}
                  label={t("labor.jshGroup2i1")}
                />
                <FormInput
                  name="electedRepresentatives1"
                  required
                  disabled
                  type="number"
                  value={values.electedRepresentatives1}
                  label={t("labor.jshGroup2i2")}
                />
              </div>
              <FormInput
                name="representatives"
                maxInput="jshGroup2i1"
                required
                suffixPlusInput={stAll}
                type="number"
                value={values.representatives}
                label={t("labor.representatives")}
              />
              <div className="modal-row">
                <FormInput
                  name="identifiedRepresentatives"
                  required
                  disabled
                  type="number"
                  value={values.identifiedRepresentatives}
                  label={t("labor.jshGroup2i3")}
                />
                <FormInput
                  name="identifiedRepresentatives1"
                  required
                  disabled
                  type="number"
                  value={values.identifiedRepresentatives1}
                  label={t("labor.jshGroup2i4")}
                />
              </div>
              <FormInput
                name="promotions"
                required
                suffixPlusInput={stAll}
                type="number"
                value={values.promotions}
                label={t("labor.promotions")}
              />
            </div>
          </Group>
        </div>
      )}
    </FormValidation>
  );
}
LaborJSHPage.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
