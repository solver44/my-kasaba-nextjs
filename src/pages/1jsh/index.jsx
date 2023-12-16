import React, { useEffect, useState } from "react";
import HomeWrapper from "../home/wrapper";
import DocumentViewer from "@/components/DocumentViewer";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { getLocalizationNames, getPresidentBKUT } from "@/utils/data";
import useAnimation from "@/hooks/useAnimation";
import EditData from "./editData";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Close, Edit } from "@mui/icons-material";
import styles from "./1jsh.module.scss";
import { useTranslation } from "react-i18next";
import FormValidation from "@/components/FormValidation";
import areEqual from "@/utils/areEqual";

export default function JSH1() {
  const [Iframe, setIframe] = useState();
  const [editMode, setEditMode] = useState(false);
  const { bkutData = {} } = useSelector((state) => state);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const animRef = useAnimation();
  const { t } = useTranslation();
  useEffect(() => {
    if (!bkutData.id) return;
    if (!bkutData.statistics?.bhutForm) setEditMode(true);
  }, [bkutData]);

  useEffect(() => {
    setIframe(
      <DocumentViewer
        generateData={{
          year: dayjs().year(),
          organization_name: bkutData.name,
          organization_address: bkutData.address,
          organization_ownership: getLocalizationNames(
            bkutData.eLegalEntity?.ownership
          ),
          organization_president: getPresidentBKUT(bkutData),
        }}
        documentSrc="/1jsh.docx"
        fileName={bkutData.name + " 1jsh hisoboti"}
      />
    );
  }, []);

  const saveStatistics = async (forms) => {
    try {
      const requestData = {
        id: bkutData.id,
        statistics: {
          ...(bkutData.statistics || {}),
          bhutForm: forms.bhutForm,
          xxtutForm: forms.xxtutForm,
          ifutForm: forms.ifutForm,
          colAgrAmount: forms.colAgrAmount,
          colAgrFinishedAmount: forms.colAgrFinishedAmount,
          includingLaborCommission: forms.includingLaborCommission,
          includingLaborConsidered: includingLaborConsidered.ifutForm,
          includingLaborSolved: forms.includingLaborSolved,
          spentColAgrSum: forms.spentColAgrSum,
        },
      };
      if (bkutData?.statistics?.id)
        requestData.statistics.id = bkutData.statistics.id;

      const response = await sendEBKUT(requestData);

      if (response?.id) {
        setEditMode(false);
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
        actions.updateData();
      } else {
        enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
      }
    } catch (error) {}
  };

  const handleSubmit = async (forms, oldForms) => {
    if (!areEqual(forms, oldForms)) {
      setLoadingEditMode(true);
      await saveStatistics(forms);
      setLoadingEditMode(false);
      setIsChanged(false);
    }
  };
  return (
    <FormValidation
      className={styles.form}
      onSubmit={handleSubmit}
      onChanged={(data, oldData) => {
        if (areEqual(data, oldData)) setIsChanged(false);
        else setIsChanged(true);
      }}
    >
      <div ref={animRef} className={styles.container}>
        <div className={styles.editBtn}>
          {editMode && (
            // && bkutData.statistics?.bhutForm
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
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} startIcon={<Edit />}>
              {t("change")}
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              type="submit"
              disabled={!isChanged}
              startIcon={<Edit />}
              loading={loadingEditMode}
            >
              {t("save")}
            </LoadingButton>
          )}
        </div>
        {!editMode ? Iframe : <EditData />}
      </div>
    </FormValidation>
  );
}
JSH1.layout = function (Component, t) {
  return <HomeWrapper title="1JSH hisoboti">{Component}</HomeWrapper>;
};
