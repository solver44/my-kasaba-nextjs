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
import { getFIO, getLastPosition, getLocalizationNames } from "@/utils/data";
import LaborApp4Report from "./reports/app4";

export default function LaborApp5Page({
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
        ? "II"
        : qr == "3"
        ? "III"
        : qr == "4"
        ? "IV"
        : "";
    return res + " " + t("labor.quarter");
  }

  function getSummarize(objName, filter) {
    return (currentReport[objName] || [])
      .filter(filter ?? ((a) => a.quarter <= quarter))
      .reduce((current, next) => {
        Object.keys(next).forEach((key) => {
          if (typeof current[key] === "undefined") current[key] = 0;
          current[key] += next[key] || 0;
        });
        return current;
      }, {});
  }

  let st = (currentReport?.app5 || []).find((a) => a.quarter == quarter) || {};
  let stAll = getSummarize("app5", (a) => a.quarter < quarter);
  useEffect(() => {
    let stApp3 = getSummarize("app3");
    let stApp4 = getSummarize("app4");

    setValues({
      quarter: getQuarter(quarter),
      damaged: st.damaged || 0,
      disabledPeople: st.disabledPeople || 0,
      personsEntitled: st.personsEntitled || 0,
      oneTimeSpent: st.oneTimeSpent || 0,
      everyMonthSpent: st.everyMonthSpent || 0,
      additionalSpent: st.additionalSpent || 0,
      entitledToReceive: st.entitledToReceive || 0,
      inCurrentYear: st.inCurrentYear || 0,
      inEarlierYear: st.inEarlierYear || 0,
      spentForFixedDamage: st.spentForFixedDamage || 0,
      oneTimeSpent1: st.oneTimeSpent1 || 0,
      everyMonthSpent1: st.everyMonthSpent1 || 0,
      additionalSpent1: st.additionalSpent1 || 0,
      allDamaged: stApp3.accidentsInProduction || 0,
      allDamaged1: stApp4.accidents1Total || 0,
      accidentsInDeath: stApp3.accidentsFatal || 0, // o'lim bilan tugagan 3-ilovadan
      accidentsSevere: stApp3.accidentsSerious || 0, // oqibati ogir 3-ilovadan
      accidentsLight: stApp4.accidentsLight || 0,
      groupBX: stApp4.groupBX || 0,
      accidents1InDeath: stApp4.accidents1InDeath || 0,
      accidents1Sever: stApp4.accidents1Sever || 0,
      accicents1Light: stApp4.accicents1Light || 0,
    });
  }, [currentReport, quarter, currentYear, isReport]);

  const handleSubmit = async (forms, oldForms) => {
    setLoadingEditMode(true);
    currentReport.quarter = quarter;
    const result = await saveReport(forms, currentReport, "app5");
    setLoadingEditMode(false);
  };

  function onFetchPINFL(data) {
    if (!data) return;

    setValues((val) => ({
      ...val,
      victimsFISH: getFIO(data),
      birthDate: dayjs(data.birth_date),
      position: getLastPosition(data),
    }));
  }

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
            st.damaged ? "" : styles.red,
          ].join(" ")}
        >
          {st.damaged ? t("report-entered") : t("report-not-entered")}
        </p>
      </div>
      {isReport ? (
        <div className={styles.reportContent}></div>
      ) : (
        <div style={{ marginTop: 20 }} className="modal-content">
          <FormInput name="id" hidden value={st?.id} />
          <FormInput
            name="allDamaged"
            disabled
            required
            type="number"
            value={values.allDamaged}
            label={t("labor.allDamaged")}
          />
          <FormInput
            name="allDamaged1"
            disabled
            required
            type="number"
            value={values.allDamaged1}
            label={t("labor.allDamaged1")}
          />
          <Group showAllBorder title={t("labor.including")}>
            <div datatype="list">
              <div className="modal-row">
                <FormInput
                  name="accidentsLight"
                  maxInput="accidentsTotal"
                  disabled
                  required
                  type="number"
                  value={values.accidentsLight}
                  label={t("labor.accidentsLight1")}
                />
                <FormInput
                  name="accicents1Light"
                  required
                  type="number"
                  disabled
                  value={values.accicents1Light}
                  label={t("labor.accicents1Light1")}
                />
                <FormInput
                  name="accidentsSevere"
                  maxInput="accidentsTotal"
                  disabled
                  required
                  type="number"
                  value={values.accidentsSevere}
                  label={t("labor.accidentsSevere1")}
                />
                <FormInput
                  name="accidents1Sever"
                  disabled
                  required
                  type="number"
                  value={values.accidents1Sever}
                  label={t("labor.accidents1Sever1")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="accidentsInDeath"
                  maxInput="accidentsTotal"
                  disabled
                  required
                  type="number"
                  value={values.accidentsInDeath}
                  label={t("labor.accidentsInDeath1")}
                />
                <FormInput
                  name="accidents1InDeath"
                  disabled
                  required
                  type="number"
                  value={values.accidents1InDeath}
                  label={t("labor.accidents1InDeath1")}
                />
                <FormInput
                  name="groupBX"
                  disabled
                  required
                  type="number"
                  value={values.groupBX}
                  label={t("labor.groupBX1")}
                />
                <FormInput
                  name="damaged"
                  suffixPlusInput={stAll}
                  required
                  type="number"
                  value={values.damaged}
                  label={t("labor.damaged")}
                />
              </div>
            </div>
          </Group>
          <FormInput
            name="disabledPeople"
            required
            suffixPlusInput={stAll}
            type="number"
            value={values.disabledPeople}
            label={t("labor.disabledPeople")}
          />
          <Group showAllBorder title={t("labor.including")}>
            <div datatype="list">
              <FormInput
                name="personsEntitled"
                required
                suffixPlusInput={stAll}
                type="number"
                value={values.personsEntitled}
                label={t("labor.personsEntitled")}
              />
              <div className="modal-row">
                <FormInput
                  name="oneTimeSpent"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.oneTimeSpent}
                  label={t("labor.oneTimeSpent")}
                />
                <FormInput
                  name="everyMonthSpent"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.everyMonthSpent}
                  label={t("labor.everyMonthSpent")}
                />
                <FormInput
                  name="additionalSpent"
                  required
                  suffixPlusInput={stAll}
                  type="number"
                  value={values.additionalSpent}
                  label={t("labor.additionalSpent")}
                />
              </div>
            </div>
          </Group>
          <FormInput
            name="entitledToReceive"
            required
            suffixPlusInput={stAll}
            type="number"
            value={values.entitledToReceive}
            label={t("labor.entitledToReceive")}
          />
          <Group showAllBorder title={t("labor.including")}>
            <FormInput
              name="inCurrentYear"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.inCurrentYear}
              label={t("labor.inCurrentYear")}
            />
            <FormInput
              name="inEarlierYear"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.inEarlierYear}
              label={t("labor.inEarlierYear")}
            />
          </Group>
          <FormInput
            name="spentForFixedDamage"
            required
            suffixPlusInput={stAll}
            type="number"
            value={values.spentForFixedDamage}
            label={t("labor.spentForFixedDamage")}
          />
          <Group showAllBorder title={t("labor.including")}>
            <FormInput
              name="oneTimeSpent1"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.oneTimeSpent1}
              label={t("labor.oneTimeSpent1")}
            />
            <FormInput
              name="everyMonthSpent1"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.everyMonthSpent1}
              label={t("labor.everyMonthSpent1")}
            />
            <FormInput
              name="additionalSpent1"
              required
              suffixPlusInput={stAll}
              type="number"
              value={values.additionalSpent1}
              label={t("labor.additionalSpent1")}
            />
          </Group>
        </div>
      )}
    </FormValidation>
  );
}
LaborApp5Page.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
