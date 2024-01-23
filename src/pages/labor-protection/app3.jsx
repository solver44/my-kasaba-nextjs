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
import { checkQuarter, getCurrentQuarter, getReportYear } from "@/utils/date";
import Group from "@/components/Group";
import dayjs from "dayjs";
import { QUARTERS } from ".";
import LaborApp3Report from "./reports/app3";
import ArticleIcon from "@mui/icons-material/Article";

export default function LaborApp3Page({
  saveReport,
  bkutData,
  data = [],
  years = [],
}) {
  const { t } = useTranslation();
  const [currentReport, setCurrentReport] = useState({});
  const [quarter, setQuarter] = useState(1);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [values, setValues] = useState({});
  const [currentYear, setYear] = useState(dayjs().year());
  const [isReport, setIsReport] = useState(false);

  const quarters = QUARTERS(1);

  function initQuarter(value) {
    const qr = getCurrentQuarter(value);
    if (qr === false) setEditMode(false);
    else setEditMode(true);
    setQuarter(qr || 1);
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

  let st = (currentReport?.app3 || []).find((a) => a.quarter == quarter) || {};
  useEffect(() => {
    const report1TI = (bkutData.reports || []).find((r) => {
      const cYear = r.year;
      return cYear == Math.min(currentYear, getReportYear());
    }) || { workersMembers: 0, studentsMembers: 0, pensionerAmount: 0 };

    if (isReport)
      st = (currentReport?.app3 || []).filter((a) => a.quarter <= quarter).reduce((current, next) => {
        Object.keys(next).forEach((key) => {
          if (typeof current[key] === "undefined") current[key] = 0;
          current[key] += next[key] || 0;
        });
        return current;
      }, {});

    setValues({
      orgName: bkutData.name,
      year: currentReport.year,
      quarter: getQuarter(quarter),
      members:
        report1TI.workersMembers +
        report1TI.studentsMembers +
        report1TI.pensionerAmount,
      numberOfSpecialist: st.numberOfSpecialist || 0,
      plannedActions: st.plannedActions || 0,
      plannedActionsSpent: st.plannedActionsSpent || 0,
      includingActions: st.includingActions || 0,
      includingSpentTransaction: st.includingSpentTransaction || 0,
      incudingSpentClothes: st.incudingSpentClothes || 0,
      includingSpentFood: st.includingSpentFood || 0,
      includingSpentHygiene: st.includingSpentHygiene || 0,
      includingSpentInsurance: st.includingSpentInsurance || 0,
      includingInsuranceEmp: st.includingInsuranceEmp || 0,
      includingSpentMedicine: st.includingSpentMedicine || 0,
      performedActions: st.performedActions || 0,
      performedActionsSpent: st.performedActionsSpent || 0,
      including2Actions: st.including2Actions || 0,
      including2SpentTransaction: st.including2SpentTransaction || 0,
      incuding2SpentClothes: st.incuding2SpentClothes || 0,
      including2SpentFood: st.including2SpentFood || 0,
      including2SpentHygiene: st.including2SpentHygiene || 0,
      including2SpentInsurance: st.including2SpentInsurance || 0,
      including2InsuranceEmp: st.including2InsuranceEmp || 0,
      including2SpentMedicine: st.including2SpentMedicine || 0,
      spentToEmp: st.spentToEmp || 0,
      participatedCommissions: st.participatedCommissions || 0,
      accidentsInProduction: st.accidentsInProduction || 0,
      accidentsFatal: st.accidentsFatal || 0,
      accidentsFatal1: st.accidentsFatal1 || 0,
      accidentsSerious: st.accidentsSerious || 0,
      accidentsSerious1: st.accidentsSerious1 || 0,
      levelOfDisability: st.levelOfDisability || 0,
      accidentsDisabledDue: st.accidentsDisabledDue || 0,
      accidentsDisabledDue1: st.accidentsDisabledDue1 || 0,
      participatedOccupational: st.participatedOccupational || 0,
      participatedOccupational1: st.participatedOccupational1 || 0,
      meetingsMedicals: st.meetingsMedicals || 0,
      meetingsMedicals1: st.meetingsMedicals1 || 0,
      participatedAttestation: st.participatedAttestation || 0,
      participatedAttestation1: st.participatedAttestation1 || 0,
      electedRepresentatives: st.electedRepresentatives || 0,
      electedRepresentatives1: st.electedRepresentatives1 || 0,
      identifiedRepresentatives: st.identifiedRepresentatives || 0,
      identifiedRepresentatives1: st.identifiedRepresentatives1 || 0,
      submittedDocuments: st.submittedDocuments || 0,
      submittedDocuments1: st.submittedDocuments1 || 0,
    });
  }, [currentReport, quarter, currentYear, isReport]);

  const handleSubmit = async (forms, oldForms) => {
    setLoadingEditMode(true);
    currentReport.quarter = quarter;
    const result = await saveReport(forms, currentReport, "app3");
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
            setEditMode(checkQuarter(value));
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
            st.plannedActions ? "" : styles.red,
          ].join(" ")}
        >
          {st.plannedActions ? t("report-entered") : t("report-not-entered")}
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
          <LaborApp3Report data={values} />
        </div>
      ) : (
        <div style={{ marginTop: 20 }} className="modal-content">
          <FormInput name="id" hidden value={currentReport.id} />
          <div className="modal-row">
            <FormInput
              name="numberOfSpecialist"
              required
              type="number"
              value={values.numberOfSpecialist}
              label={t("labor.numberOfSpecialist")}
            />
            <FormInput
              name="plannedActions"
              required
              type="number"
              value={values.plannedActions}
              label={t("labor.plannedActions")}
            />
          </div>
          <Group showAllBorder title={t("labor.including")}>
            <div datatype="list">
              <div className="modal-row">
                <FormInput
                  name="plannedActionsSpent"
                  required
                  type="number"
                  value={values.plannedActionsSpent}
                  label={t("labor.plannedActionsSpent")}
                />
                <FormInput
                  name="includingActions"
                  required
                  type="number"
                  value={values.includingActions}
                  label={t("labor.includingActions")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="includingSpentTransaction"
                  required
                  type="number"
                  value={values.includingSpentTransaction}
                  label={t("labor.includingSpentTransaction")}
                />
                <FormInput
                  name="incudingSpentClothes"
                  required
                  type="number"
                  value={values.incudingSpentClothes}
                  label={t("labor.incudingSpentClothes")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="includingSpentFood"
                  required
                  type="number"
                  value={values.includingSpentFood}
                  label={t("labor.includingSpentFood")}
                />
                <FormInput
                  name="includingSpentHygiene"
                  required
                  type="number"
                  value={values.includingSpentHygiene}
                  label={t("labor.includingSpentHygiene")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="includingSpentInsurance"
                  required
                  type="number"
                  value={values.includingSpentInsurance}
                  label={t("labor.includingSpentInsurance")}
                />
                <FormInput
                  name="includingInsuranceEmp"
                  required
                  type="number"
                  value={values.includingInsuranceEmp}
                  label={t("labor.includingInsuranceEmp")}
                />
              </div>
              <FormInput
                name="includingSpentMedicine"
                required
                type="number"
                value={values.includingSpentMedicine}
                label={t("labor.includingSpentMedicine")}
              />
            </div>
          </Group>
          <FormInput
            name="performedActions"
            required
            type="number"
            value={values.performedActions}
            label={t("labor.performedActions")}
          />
          <Group showAllBorder title={t("labor.including")}>
            <div datatype="list">
              <FormInput
                name="performedActionsSpent"
                required
                type="number"
                value={values.performedActionsSpent}
                label={t("labor.performedActionsSpent")}
              />
              <div className="modal-row">
                <FormInput
                  name="including2Actions"
                  required
                  type="number"
                  value={values.including2Actions}
                  label={t("labor.including2Actions")}
                />
                <FormInput
                  name="including2SpentTransaction"
                  required
                  type="number"
                  value={values.including2SpentTransaction}
                  label={t("labor.including2SpentTransaction")}
                />
              </div>
              <div className="modal-row">
                <FormInput
                  name="incuding2SpentClothes"
                  required
                  type="number"
                  value={values.incuding2SpentClothes}
                  label={t("labor.incuding2SpentClothes")}
                />
                <FormInput
                  name="including2SpentFood"
                  required
                  type="number"
                  value={values.including2SpentFood}
                  label={t("labor.including2SpentFood")}
                />
              </div>
              <FormInput
                name="including2SpentHygiene"
                required
                type="number"
                value={values.including2SpentHygiene}
                label={t("labor.including2SpentHygiene")}
              />
              <div className="modal-row">
                <FormInput
                  name="including2SpentInsurance"
                  required
                  type="number"
                  value={values.including2SpentInsurance}
                  label={t("labor.including2SpentInsurance")}
                />
                <FormInput
                  name="including2InsuranceEmp"
                  required
                  type="number"
                  value={values.including2InsuranceEmp}
                  label={t("labor.including2InsuranceEmp")}
                />
              </div>
              <FormInput
                name="including2SpentMedicine"
                required
                type="number"
                value={values.including2SpentMedicine}
                label={t("labor.including2SpentMedicine")}
              />
            </div>
          </Group>
          <FormInput
            name="spentToEmp"
            required
            type="number"
            value={values.spentToEmp}
            label={t("labor.spentToEmp")}
          />
          <FormInput
            name="participatedCommissions"
            required
            type="number"
            value={values.participatedCommissions}
            label={t("labor.participatedCommissions")}
          />
          <FormInput
            name="accidentsInProduction"
            required
            type="number"
            value={values.accidentsInProduction}
            label={t("labor.accidentsInProduction")}
          />
          <div className="modal-row">
            <FormInput
              name="accidentsFatal"
              maxInput="accidentsInProduction"
              required
              type="number"
              value={values.accidentsFatal}
              label={t("labor.accidentsFatal")}
            />
            <FormInput
              name="accidentsFatal1"
              maxInput="accidentsFatal"
              required
              type="number"
              value={values.accidentsFatal1}
              label={t("labor.accidentsFatal1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="accidentsSerious"
              maxInput="accidentsInProduction"
              required
              type="number"
              value={values.accidentsSerious}
              label={t("labor.accidentsSerious")}
            />
            <FormInput
              name="accidentsSerious1"
              maxInput="accidentsSerious"
              required
              type="number"
              value={values.accidentsSerious1}
              label={t("labor.accidentsSerious1")}
            />
          </div>
          <FormInput
            name="levelOfDisability"
            required
            type="number"
            value={values.levelOfDisability}
            label={t("labor.levelOfDisability")}
          />
          <div className="modal-row">
            <FormInput
              name="accidentsDisabledDue"
              maxInput="levelOfDisability"
              required
              type="number"
              value={values.accidentsDisabledDue}
              label={t("labor.accidentsDisabledDue")}
            />
            <FormInput
              name="accidentsDisabledDue1"
              required
              type="number"
              value={values.accidentsDisabledDue1}
              label={t("labor.accidentsDisabledDue1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="participatedOccupational"
              required
              type="number"
              value={values.participatedOccupational}
              label={t("labor.participatedOccupational")}
            />
            <FormInput
              name="participatedOccupational1"
              maxInput="participatedOccupational"
              required
              type="number"
              value={values.participatedOccupational1}
              label={t("labor.participatedOccupational1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="meetingsMedicals"
              required
              type="number"
              value={values.meetingsMedicals}
              label={t("labor.meetingsMedicals")}
            />
            <FormInput
              name="meetingsMedicals1"
              required
              type="number"
              value={values.meetingsMedicals1}
              label={t("labor.meetingsMedicals1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="participatedAttestation"
              required
              type="number"
              value={values.participatedAttestation}
              label={t("labor.participatedAttestation")}
            />
            <FormInput
              name="participatedAttestation1"
              required
              type="number"
              value={values.participatedAttestation1}
              label={t("labor.participatedAttestation1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="electedRepresentatives"
              required
              type="number"
              value={values.electedRepresentatives}
              label={t("labor.electedRepresentatives")}
            />
            <FormInput
              name="electedRepresentatives1"
              maxInput="electedRepresentatives"
              required
              type="number"
              value={values.electedRepresentatives1}
              label={t("labor.electedRepresentatives1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="identifiedRepresentatives"
              required
              type="number"
              value={values.identifiedRepresentatives}
              label={t("labor.identifiedRepresentatives")}
            />
            <FormInput
              name="identifiedRepresentatives1"
              maxInput="identifiedRepresentatives"
              required
              type="number"
              value={values.identifiedRepresentatives1}
              label={t("labor.identifiedRepresentatives1")}
            />
          </div>
          <div className="modal-row">
            <FormInput
              name="submittedDocuments"
              required
              type="number"
              value={values.submittedDocuments}
              label={t("labor.submittedDocuments")}
            />
          </div>
          <FormInput
            name="submittedDocuments1"
            maxInput="submittedDocuments"
            required
            type="number"
            value={values.submittedDocuments1}
            label={t("labor.submittedDocuments1")}
          />
        </div>
      )}
    </FormValidation>
  );
}
LaborApp3Page.layout = function (Component, t) {
  return <HomeWrapper title={t("labor-protection")}>{Component}</HomeWrapper>;
};
