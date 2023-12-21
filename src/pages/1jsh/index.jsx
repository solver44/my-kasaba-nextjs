import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getPresidentBKUT } from "@/utils/data";
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

export default function JSH1() {
  const [editMode, setEditMode] = useState(false);
  const { bkutData = {} } = useSelector((state) => state);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const [currentReport, setCurrentReport] = useState({});
  const [years, setYears] = useState([]);
  const [currentYear, setYear] = useState(dayjs().year());
  const animRef = useAnimation();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  useEffect(() => {
    if (!bkutData.id) return;
    const allYears = [];
    const y = dayjs().year();
    (bkutData.collectiveAgreementsReports || []).forEach((r) => {
      const cYear = dayjs(r.date).year();
      if (cYear == y) return;
      allYears.push({
        value: cYear,
        label: t("for-year", { year: cYear }),
        labelRu: t("for-year", { year: cYear }),
      });
    });
    allYears.push({ value: y, label: t("for-year", { year: y }) });
    setYears(allYears.reverse());
  }, [bkutData]);

  useEffect(() => {
    if (!bkutData.id) return;
    const temp = (bkutData.collectiveAgreementsReports || []).find((r) => {
      const cYear = dayjs(r.date).year();
      return cYear == currentYear;
    });
    setCurrentReport(temp || { date: dayjs().format("YYYY-MM-DD") });
    if (!temp?.bhutForm && !editMode) setEditMode(true);
  }, [currentYear, bkutData]);

  const saveStatistics = async (forms) => {
    try {
      const requestData = {
        reports: {
          eBKUT: {
            id: bkutData.id,
          },
          date: forms.date,
          bhutForm: forms.bhutForm,
          xxtutForm: forms.xxtutForm,
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
      };
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
    <FormValidation
      className={styles.form}
      onSubmit={handleSubmit}
      // onChanged={(data, oldData) => {
      //   if (areEqual(data, oldData)) setIsChanged(false);
      //   else setIsChanged(true);
      // }}
    >
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
              dayjs(currentReport?.date).year() == dayjs().year() && (
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
            {!editMode && <ChangableInput
              style={{ width: 200 }}
              hideEmpty
              value={currentYear}
              select
              dataSelect={years}
              onChange={({ target: { value } }) => setYear(value)}
            />}
            <p
              className={[
                styles.titleYear,
                currentReport?.ifutForm ? "" : styles.red,
              ].join(" ")}
            >
              {currentReport?.ifutForm
                ? t("report-entered")
                : t("report-not-entered")}
            </p>
          </React.Fragment>
        </div>
        {!editMode ? (
          <DocumentViewer
            generateData={{
              year: dayjs(currentReport?.date || undefined).year(),
              dbibt: bkutData.eLegalEntity?.soogu?.code || "",
              dbibt_name: bkutData.eLegalEntity?.soogu?.nameUz || "",
              ktut_form: bkutData.eLegalEntity?.soogu?.ktutCode || "",
              txt_form: bkutData.eLegalEntity?.opf?.code || "",
              txt: bkutData.eLegalEntity?.opf?.nameUz || "",
              msht_form: bkutData.eLegalEntity?.ownership?.code || "",
              main_activity: bkutData.eLegalEntity?.mainActivity || "",
              stir: bkutData.tin,
              soato: bkutData.eLegalEntity?.soato?.code || "",
              organization_name: bkutData.name || "",
              organization_address: bkutData.address || "",
              organization_ownership:
                bkutData.eLegalEntity?.ownership?.nameUz || "",
              organization_president: getPresidentBKUT(bkutData) || "",
              employees_count: bkutData.statistics?.workersAmount || "",

              bhut_form: currentReport.bhutForm,
              xxtut_form: currentReport.xxtutForm,
              ifut_form: currentReport.ifutForm,
              colAgrAmount: currentReport.colAgrAmount,
              colAgrFinishedAmount: currentReport.colAgrFinishedAmount,
              includingLaborCommission: currentReport.includingLaborCommission,
              labors: `${currentReport.includingLaborConsidered}/${currentReport.includingLaborSolved}`,
              spentColAgrSum: currentReport.spentColAgrSum,
              resultSpentAmount: (
                (currentReport.spentColAgrSum || 0) /
                (bkutData.statistics?.workersAmount || 0)
              ).toFixed(2),
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
