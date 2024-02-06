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
    if (!temp?.bhutForm && !editMode) setEditMode(true);
  }, [currentYear, bkutData]);

  const saveStatistics = async (forms) => {
    try {
      const requestData = {
        reports: {
          year: currentReport.year,
          date: forms.date,
          bhutForm: forms.bhutForm,
          ifutForm: forms.ifutForm,
          colAgrAmount: forms.colAgrAmount,
          colAgrFinishedAmount: forms.colAgrFinishedAmount,
          includingLaborCommission: forms.includingLaborCommission,
          includingLaborConsidered: forms.includingLaborConsidered,
          includingLaborSolved: forms.includingLaborSolved,
          spentColAgrSum: forms.spentColAgrSum,
        },
        mainActivity: forms.mainActivity,
        dbibt: forms.dbibt.value,
        soato: forms.soato.value,
        opf: forms.txt.value,
        ownership: forms.msht.value,
        ifut: forms.ifut.value,
        xxtut: forms.xxtut.value,
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
              currentReport?.year == getReportYear(settings) && (
                <LoadingButton
                  variant="contained"
                  type="submit"
                  // disabled={!isChanged}
                  startIcon={<Edit />}
                  loading={loadingEditMode}
                >
                  {t("save")}
                </LoadingButton>
              )
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
                currentReport?.colAgrAmount ? "" : styles.red,
              ].join(" ")}
            >
              {currentReport?.colAgrAmount
                ? t("report-entered")
                : t("report-not-entered")}
            </p>
          </React.Fragment>
        </div>
        {!editMode ? (
          <DocumentViewer
            generateData={{
              year: currentReport?.year,
              dbibt: bkutData.eLegalEntity?.soogu?.code || "",
              dbibt_name: bkutData.eLegalEntity?.soogu?.nameUz || "",
              ktut_form: bkutData.eLegalEntity?.soogu?.ktutCode || "",
              txt_form: bkutData.eLegalEntity?.opf?.code || "",
              txt: bkutData.eLegalEntity?.opf?.nameUz || "",
              msht_form: bkutData.eLegalEntity?.ownership?.code || "",
              main_activity: bkutData.eLegalEntity?.mainActivity || "",
              xxtut_form: bkutData.eLegalEntity?.okonx?.code || "",
              ifut_form: bkutData.eLegalEntity?.oked?.code || "",
              stir: bkutData.tin || "",
              soato: bkutData.eLegalEntity?.soato?.code || "",
              organization_name: bkutData.name || "",
              organization_address: bkutData.address || "",
              organization_ownership:
                bkutData.eLegalEntity?.ownership?.nameUz || "",
              organization_president: getPresidentBKUT(bkutData) || "",
              employees_count: employeeCount || "0",

              bhut_form: currentReport.bhutForm || "",
              colAgrAmount: currentReport.colAgrAmount || "",
              colAgrFinishedAmount: currentReport.colAgrFinishedAmount || "",
              includingLaborCommission:
                currentReport.includingLaborCommission || "",
              labors: `${showOrNot(
                currentReport.includingLaborConsidered
              )}/${showOrNot(currentReport.includingLaborSolved)}`,
              spentColAgrSum: currentReport.spentColAgrSum || "",
              resultSpentAmount: employeeCount
                ? ((currentReport.spentColAgrSum || 0) / employeeCount).toFixed(
                    2
                  )
                : 0,
            }}
            documentSrc="/1jsh.docx"
            fileName={bkutData.name + " 1jsh hisoboti"}
          />
        ) : (
          <EditData currentReport={currentReport} />
        )}
      </div>
    </FormValidation>
  );
}
JSH1.layout = function (Component, t) {
  return <HomeWrapper title="1JSH hisoboti">{Component}</HomeWrapper>;
};
