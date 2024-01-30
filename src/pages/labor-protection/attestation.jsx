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
  getInstance,
  getLastPosition,
  getLocalizationNames,
  getSummarize,
} from "@/utils/data";
import LaborApp4Report from "./reports/app4";
import LaborJSHReport from "./reports/jsh";
import LaborMedicalReport from "./reports/medical";
import LaborAttestationReport from "./reports/attestation";

export default function LaborAttestationPage({
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

  function getFloatVal(num) {
    return num === Infinity ? 0.0 : isNaN(num) ? 0.0 : num;
  }

  function getValues(st, stApp3) {
    const harmfulCount = st.harmfulJobs || 0 ? 1 : 0,
      certifiedCount = stApp3.participatedAttestation1 || 0 ? 1 : 0,
      harmfulJobs = st.harmfulJobs || 0,
      participatedAttestation1 = stApp3.participatedAttestation1 || 0,
      number1 = st.number1 || 0,
      number2 = st.number2 || 0,
      number3 = st.number3 || 0,
      extraVacation = st.extraVacation || 0,
      foodSupply = st.foodSupply || 0,
      treatment = st.treatment || 0,
      specialClothes = st.specialClothes || 0,
      preferentialTerms = st.preferentialTerms || 0;
    const values = {
      name: bkutData.name,
      branchSoato: `${getInstance(bkutData.branch)}, ${getInstance(
        bkutData.soato
      )}`,
      harmfulCount,
      certifiedCount,
      percentage: getFloatVal((harmfulCount / certifiedCount) * 100),
      harmfulJobs,
      participatedAttestation1,
      percentage1: getFloatVal((harmfulJobs / participatedAttestation1) * 100),
      number1,
      number2,
      number3,
      extraVacation,
      foodSupply,
      treatment,
      specialClothes,
      preferentialTerms,
      all:
        number1 +
        number2 +
        number3 +
        extraVacation +
        foodSupply +
        treatment +
        specialClothes +
        preferentialTerms,
      allCount:
        number1 +
        number2 +
        number3 +
        extraVacation +
        foodSupply +
        treatment +
        specialClothes +
        preferentialTerms,
    };
    return values;
  }

  let st =
    (currentReport?.attestation || []).find((a) => a.quarter == quarter) || {};
  let stAll = getSummarize(
    "attestation",
    (a) => a.quarter < quarter,
    currentReport,
    quarter
  );
  let stApp3 = getSummarize("app3", null, currentReport, quarter);
  useEffect(() => {
    if (isReport) {
      st = getSummarize("attestation", null, currentReport, quarter);
    }

    setValues(getValues(st, stApp3));

    if (isReport) {
      const currValue = getValues(st, stApp3);
      const temp = {
        year: currentYear,
        data: [currValue],
      };
      setReportData(temp);
    }
  }, [currentReport, quarter, currentYear, isReport]);

  const handleSubmit = async (forms, oldForms) => {
    setLoadingEditMode(true);
    currentReport.quarter = quarter;
    const { percentage1, percentage, all, ...request } = getValues(
      forms,
      stApp3
    );
    const result = await saveReport(request, currentReport, "attestation");
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
          className={[styles.titleYear, st.harmfulJobs ? "" : styles.red].join(
            " "
          )}
        >
          {st.harmfulJobs ? t("report-entered") : t("report-not-entered")}
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
          <LaborAttestationReport data={reportData} />
        </div>
      ) : (
        <div style={{ marginTop: 20 }} className="modal-content">
          <FormInput name="id" hidden value={st?.id} />
          <FormInput name="all" hidden value={values.all} />
          <FormInput name="harmfulCount" hidden value={values.harmfulCount} />
          <FormInput
            name="certifiedCount"
            hidden
            value={values.certifiedCount}
          />
          <div className="modal-row">
            <FormInput
              name="harmfulJobs"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.harmfulJobs}
              label={t("labor.harmfulJobs")}
            />
            <FormInput
              name="participatedAttestation1"
              required
              disabled
              type="number"
              value={values.participatedAttestation1}
              label={t("labor.attestationI1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="number1"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.number1}
              label={t("labor.number1")}
            />
            <FormInput
              name="number2"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.number2}
              label={t("labor.number2")}
            />
            <FormInput
              name="number3"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.number3}
              label={t("labor.number3")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="extraVacation"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.extraVacation}
              label={t("labor.extraVacation")}
            />
            <FormInput
              name="foodSupply"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.foodSupply}
              label={t("labor.foodSupply")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="treatment"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.treatment}
              label={t("labor.treatment")}
            />
            <FormInput
              name="specialClothes"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.specialClothes}
              label={t("labor.specialClothes")}
            />
          </div>
          <FormInput
            name="preferentialTerms"
            required
            suffixPlusInput={stAll}
            type="number"
            value={values.preferentialTerms}
            label={t("labor.preferentialTerms")}
          />
        </div>
      )}
    </FormValidation>
  );
}
LaborAttestationPage.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
