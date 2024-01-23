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
import LaborApp3Report from "./reports/app3";
import ArticleIcon from "@mui/icons-material/Article";
import FinderPINFL from "@/components/FinderPINFL";
import { getFIO, getLastPosition, getLocalizationNames } from "@/utils/data";
import LaborApp4Report from "./reports/app4";

export default function LaborApp4Page({
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

  let st = (currentReport?.app4 || []).find((a) => a.quarter == quarter) || {};
  useEffect(() => {
    const exclude = [
      "nameOfThePlace",
      "dateOfAccident",
      "victimsFISH",
      "birthDate",
      "position",
      "descriptionOfAccident",
      "causesOfAccident",
      "tmekToVictim",
      "lawEnforcment",
      "reviewResult",
    ];

    if (isReport)
      st = (currentReport?.app4 || [])
        .filter((a) => a.quarter <= quarter)
        .reduce((current, next) => {
          Object.keys(next).forEach((key) => {
            if (exclude.includes(key)) return (current[key] = next[key]);
            if (typeof current[key] === "undefined") current[key] = 0;
            current[key] += next[key] || 0;
          });
          return current;
        }, {});

    setValues({
      nameOfThePlace: st.nameOfThePlace || "",
      dateOfAccident: st.dateOfAccident || "",
      victimsFISH: st.victimsFISH || "",
      birthDate: st.birthDate || "",
      position: st.position || "",
      descriptionOfAccident: st.descriptionOfAccident || "",
      causesOfAccident: st.causesOfAccident || "",
      tmekToVictim: st.tmekToVictim || "",
      lawEnforcment: st.lawEnforcment || "",
      reviewResult: st.reviewResult || "",
      accidentsTotal: st.accidentsTotal || 0,
      accidentsInDeath: st.accidentsInDeath || 0,
      accidentsSevere: st.accidentsSevere || 0,
      accidentsLight: st.accidentsLight || 0,
      groupBX: st.groupBX || 0,
      accidents1Total: st.accidents1Total || 0,
      accidents1InDeath: st.accidents1InDeath || 0,
      accidents1Sever: st.accidents1Sever || 0,
      accicents1Light: st.accicents1Light || 0,
    });
  }, [currentReport, quarter, currentYear, isReport]);

  const handleSubmit = async (forms, oldForms) => {
    setLoadingEditMode(true);
    currentReport.quarter = quarter;
    const result = await saveReport(forms, currentReport, "app4");
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
            st.nameOfThePlace ? "" : styles.red,
          ].join(" ")}
        >
          {st.nameOfThePlace ? t("report-entered") : t("report-not-entered")}
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
          <LaborApp4Report
            data={{
              year: currentReport.year,
              quarter: getQuarter(quarter),
              p1: getLocalizationNames(bkutData?.eLegalEntity?.soogu),
              p2: bkutData.name,
              p3: getLocalizationNames(bkutData.branch),
              p4: getLocalizationNames(bkutData?.soato?.parent),
              p5: getLocalizationNames(bkutData.soato),
              p6: bkutData.name,
              data: [values],
            }}
          />
        </div>
      ) : (
        <div style={{ marginTop: 20 }} className="modal-content">
          <FormInput name="id" hidden value={st?.id} />
          <div className="modal-row">
            <FormInput
              name="nameOfThePlace"
              required
              value={values.nameOfThePlace}
              label={t("labor.nameOfThePlace")}
            />
            <FormInput
              name="dateOfAccident"
              required
              date
              value={values.dateOfAccident}
              label={t("labor.dateOfAccident")}
            />
          </div>

          <Group showAllBorder title={t("labor.victim")}>
            <div datatype="list">
              <div className="modal-row">
                <FinderPINFL
                  removeGivenDate
                  disablePINFL
                  onFetch={onFetchPINFL}
                />
                <FormInput
                  name="victimsFISH"
                  // disabled
                  required
                  value={values.victimsFISH}
                  label={t("labor.victimsFISH")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="birthDate"
                  // disabled
                  required
                  date
                  value={values.birthDate}
                  label={t("labor.birthDate")}
                />
                <FormInput
                  name="position"
                  required
                  value={values.position}
                  label={t("labor.position")}
                />
              </div>
            </div>
          </Group>

          <FormInput
            name="descriptionOfAccident"
            required
            value={values.descriptionOfAccident}
            label={t("labor.descriptionOfAccident")}
          />
          <div className="modal-row">
            <FormInput
              name="causesOfAccident"
              required
              value={values.causesOfAccident}
              label={t("labor.causesOfAccident")}
            />
            <FormInput
              name="tmekToVictim"
              required
              value={values.tmekToVictim}
              label={t("labor.tmekToVictim")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="lawEnforcment"
              required
              value={values.lawEnforcment}
              label={t("labor.lawEnforcment")}
            />
            <FormInput
              name="reviewResult"
              required
              value={values.reviewResult}
              label={t("labor.reviewResult")}
            />
          </div>
          <FormInput
            name="accidentsTotal"
            required
            type="number"
            value={values.accidentsTotal}
            label={t("labor.accidentsTotal")}
          />
          <Group showAllBorder title={t("labor.including")}>
            <FormInput
              name="accidentsInDeath"
              maxInput="accidentsTotal"
              required
              type="number"
              value={values.accidentsInDeath}
              label={t("labor.accidentsInDeath")}
            />
            <FormInput
              name="accidentsSevere"
              maxInput="accidentsTotal"
              required
              type="number"
              value={values.accidentsSevere}
              label={t("labor.accidentsSevere")}
            />
            <FormInput
              name="accidentsLight"
              maxInput="accidentsTotal"
              required
              type="number"
              value={values.accidentsLight}
              label={t("labor.accidentsLight")}
            />
            <FormInput
              name="groupBX"
              required
              type="number"
              value={values.groupBX}
              label={t("labor.groupBX")}
            />
          </Group>
          <FormInput
            name="accidents1Total"
            required
            type="number"
            value={values.accidents1Total}
            label={t("labor.accidents1Total")}
          />
          <Group showAllBorder title={t("labor.including")}>
            <FormInput
              name="accidents1InDeath"
              required
              type="number"
              value={values.accidents1InDeath}
              label={t("labor.accidents1InDeath")}
            />
            <FormInput
              name="accidents1Sever"
              required
              type="number"
              value={values.accidents1Sever}
              label={t("labor.accidents1Sever")}
            />
            <FormInput
              name="accicents1Light"
              required
              type="number"
              value={values.accicents1Light}
              label={t("labor.accicents1Light")}
            />
          </Group>
        </div>
      )}
    </FormValidation>
  );
}
LaborApp4Page.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
