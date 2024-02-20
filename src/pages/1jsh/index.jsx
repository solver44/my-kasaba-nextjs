import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getPresidentBKUT, showOrNot } from "@/utils/data";
import useAnimation from "@/hooks/useAnimation";
import EditData from "./editData";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Close, Edit } from "@mui/icons-material";
import styles from "./1jsh.module.scss";
import { useTranslation } from "react-i18next";
import FormValidation from "@/components/FormValidation";
import ChangableInput from "@/components/ChangableInput";
import { sendCollectiveReport } from "@/http/data";
import { useSnackbar } from "notistack";
import useActions from "@/hooks/useActions";
import { getReportDate, getReportYear, getYearFrom } from "@/utils/date";

export default function JSH1() {
  const [editMode, setEditMode] = useState(false);
  const {
    bkutData = {},
    isOrganization,
    settings = {},
  } = useSelector((state) => state);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [currentReport, setCurrentReport] = useState({});
  const [employeeCount, setEmployeeCount] = useState(0);
  const [years, setYears] = useState([]);
  const [currentYear, setYear] = useState(getReportYear(settings));
  const animRef = useAnimation();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  useEffect(() => {
    if (!bkutData.id) return;
    const allYears = [];
    const y = getReportYear(settings);
    const prevY = y - 1;
    (bkutData.collectiveAgreementsReports || []).forEach((r) => {
      const cYear = r.year;
      if (cYear == y || cYear == prevY) return;
      allYears.push({
        value: cYear,
        label: t("for-year", { year: cYear }),
        labelRu: t("for-year", { year: cYear }),
      });
    });
    allYears.push({ value: y, label: t("for-year", { year: y }) });
    allYears.push({ value: prevY, label: t("for-year", { year: prevY }) });
    setYears(allYears.sort((a, b) => b.value - a.value));
  }, [bkutData]);

  useEffect(() => {
    if (!bkutData.id) return;
    const temp = (bkutData.collectiveAgreementsReports || []).find((r) => {
      const cYear = r.year;
      return cYear == currentYear;
    });
    const temp1 = (bkutData.reports || []).find((r) => {
      const cYear = r.year;
      return cYear == currentYear;
    });
    setEmployeeCount(temp1?.workersAmount || 0);
    setCurrentReport(
      temp || { year: currentYear, date: getReportDate(null, currentYear) }
    );
    if (!temp?.id && !editMode) setEditMode(true);
  }, [currentYear, bkutData]);

  function validValue(num) {
    return isNaN(num) || num == Infinity ? 0 : num;
  }

  const saveStatistics = async (forms) => {
    try {
      const v1 = forms.spentColAgrSum || 0,
        v2 = forms.employeesCount || 0;

      const requestData = {
        reports: {
          year: currentReport.year,
          date: forms.date,
          bhutForm: forms.bhutForm,
          ifutForm: forms.ifutForm,
          colAgrAmount: forms.colAgrAmount,
          colAgrFinishedAmount: forms.colAgrFinishedAmount,
          signed: forms.signed,
          seperateDepartments: forms.seperateDepartments,
          spentColAgrSum: v1.toFixed(2),
          employeesCount: v2,
          resultSpentAmount: validValue((v1 / v2).toFixed(2)),
        },
        mainActivity: forms.mainActivity,
        dbibt: forms.dbibt.value,
        soato: forms.soato.value,
        opf: forms.txt.value,
        ownership: forms.msht.value,
        ifut: forms.ifut.value,
        xxtut: forms.xxtut.value,
        receiverJsh: forms.receiverJsh || "",
        receiverAddress: forms.receiverAddress || "",
      };
      if (isOrganization)
        requestData.reports.eBkutOrganization = { id: bkutData.id };
      else requestData.reports.eBKUT = { id: bkutData.id };
      if (forms?.id) requestData.reports.id = forms.id;

      const response = await sendCollectiveReport(requestData);

      if (response?.success) {
        setEditMode(false);
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
        actions.updateData();
      } else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (forms, oldForms) => {
    setLoadingEditMode(true);
    await saveStatistics(forms);
    setLoadingEditMode(false);
    setIsChanged(false);
  };

  const lEntity = bkutData.eLegalEntity || {};

  return (
    <FormValidation className={styles.form} onSubmit={handleSubmit}>
      <div ref={animRef} className={styles.container}>
        <div className={styles.editBtn}>
          {editMode && (
            <Button
              variant="text"
              onClick={() => {
                setIsChanged(false);
                setEditMode(false);
              }}
              startIcon={<Close />}
              disabled={loadingEditMode}
              type="button"
            >
              {t("leave")}
            </Button>
          )}
          <React.Fragment>
            {!editMode ? (
              <Button onClick={() => setEditMode(true)} startIcon={<Edit />}>
                {t("change")}
              </Button>
            ) : (
              // currentReport?.year == getReportYear(settings) &&
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
            {!editMode && (
              <ChangableInput
                style={{ width: 200 }}
                hideEmpty
                value={currentYear}
                select
                dataSelect={years}
                onChange={({ target: { value } }) => setYear(value)}
              />
            )}
            <p
              className={[
                styles.titleYear,
                currentReport?.id ? "" : styles.red,
              ].join(" ")}
            >
              {currentReport?.id
                ? t("report-entered")
                : t("report-not-entered")}
            </p>
          </React.Fragment>
        </div>
        {!editMode ? (
          <DocumentViewer
            generateData={{
              year: currentReport?.year,
              dbibt: lEntity.soogu?.code || "",
              dbibt_name: lEntity.soogu?.nameUz || "",
              ktut_form: lEntity.soogu?.ktutCode || "",
              txt_form: lEntity.opf?.code || "",
              txt: lEntity.opf?.nameUz || "",
              msht_form: lEntity.ownership?.code || "",
              main_activity: lEntity.mainActivity || "",
              xxtut_form: lEntity.okonx?.code || "",
              ifut_form: lEntity.oked?.code || "",
              stir: bkutData.tin || "",
              soato: lEntity.soato?.code || "",
              organization_name: bkutData.name || "",
              receiver: lEntity.receiverJsh
                ? `${lEntity.receiverJsh}, ${lEntity.receiverAddress || ""}`
                : "",
              day: dayjs().daysInMonth(),
              month: dayjs().month(),
              organization_address: bkutData.address || "",
              organization_ownership:
                bkutData.eLegalEntity?.ownership?.nameUz || "",
              organization_president: getPresidentBKUT(bkutData) || "",

              bhut_form: "071002",
              colAgrAmount: currentReport.colAgrAmount || 0,
              colAgrFinishedAmount: currentReport.colAgrFinishedAmount || 0,
              spentColAgrSum: currentReport.spentColAgrSum || 0,
              employees_count: currentReport.employeesCount || 0,
              seperateDepartments: currentReport.seperateDepartments || 0,
              signed: currentReport.signed || 0,
              resultSpentAmount: currentReport.resultSpentAmount || 0,
            }}
            documentSrc="/1jsh.docx"
            fileName={bkutData.name + " (1JSh hisoboti)"}
          />
        ) : (
          <EditData currentReport={currentReport} />
        )}
      </div>
    </FormValidation>
  );
}
JSH1.layout = function (Component, t) {
  return <HomeWrapper title="1JSh hisoboti">{Component}</HomeWrapper>;
};
