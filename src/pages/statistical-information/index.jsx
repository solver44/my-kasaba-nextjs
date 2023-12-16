import React, { useRef, useState } from "react";
import HomeWrapper from "../home/wrapper";
import styles from "./statistical-information.module.scss";
import useAnimation from "@/hooks/useAnimation";
import { Button } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useTranslation } from "react-i18next";
import EditIcon from "@mui/icons-material/Edit";
import { Close } from "@mui/icons-material";
import FormValidation from "@/components/FormValidation";
import areEqual from "@/utils/areEqual";
import CardUI from "@/components/Card";
import BarCharts from "@/components/Charts/Bar";
import PieCharts from "@/components/Charts/Pie";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { sendEBKUT, sendStatistics } from "@/http/data";
import { useSelector } from "react-redux";
import { enqueueSnackbar } from "notistack";
import EditData from "./editData";
import useActions from "@/hooks/useActions";

export default function StatisticalInformation() {
  const { t } = useTranslation();
  const actions = useActions();
  const [editMode, setEditMode] = useState(false);
  const { bkutData = {} } = useSelector((states) => states);
  const [loadingEditMode, setLoadingEditMode] = useState(false);
  const [isChanged, setIsChanged] = useState(false);
  const animRef = useAnimation();
  const allText = t("statistical-information.all");
  // const employeesText = t("statistical-information.employees");
  const womenText = t("statistical-information.women");
  const adultsText = t("statistical-information.adults");

  const saveStatistics = async (forms) => {
    try {
      const requestData = {
        id: bkutData.id,
        statistics: {
          ...(bkutData.statistics || {}),
          workersAdults: forms.workersAdults,
          workersFemale: forms.workersFemale,
          firedMembersAmount: forms.firedMembersAmount,
          staffingResponsibleWorkers: forms.staffingResponsibleWorkers,
          homemakerAmount: forms.homemakerAmount,
          isProvidedPC: forms.isProvidedPC,
          staffingTechnicalWorkers: forms.staffingTechnicalWorkers,
          isProvidedInternet: forms.isProvidedInternet,
          newMemebersAmount: forms.newMemebersAmount,
          pensionerAmount: forms.pensionerAmount,
          isProvidedPaidApparatus: forms.isProvidedPaidApparatus,
          studentsFemale: forms.studentsFemale,
          workersMembers: forms.workersMembers,
          isFiredFromMainJob: forms.isFiredFromMainJob,
          staffingWorkersAmount: forms.staffingWorkersAmount,
          isCollegialPresident: forms.isCollegialPresident,
          workersAmount: forms.workersAmount,
          membersProvidedTicket: forms.membersProvidedTicket,
          studentsAdultsMembers: forms.studentsAdultsMembers,
          studentsAmount: forms.studentsAmount,
          studentsAdults: forms.studentsAdults,
          studentsMembers: forms.studentsMembers,
          studentsFemaleMembers: forms.studentsFemaleMembers,
          invalidAmount: forms.invalidAmount,
          salaryByAgreements: forms.salaryByAgreements,
          spentAmount: forms.spentAmount,
          workersFemaleMembers: forms.workersFemaleMembers,
          workersAdultsMembers: forms.workersAdultsMembers,
          staffingAmount: forms.staffingAmount,
          staffingResponsibleWorkers: forms.staffingResponsibleWorkers,
          isProvidedPC: forms.isProvidedPC,
          isProvidedInternet: forms.isProvidedInternet,
          isProvidedPaidApparatus: forms.isProvidedPaidApparatus,
          isFiredFromMainJob: forms.isFiredFromMainJob,
          isCollegialPresident: forms.isCollegialPresident,
          isProvidedPrivateRoom: forms.isProvidedPrivateRoom,
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

  const categories = [t("all"), t("statistical-information.group2")];
  const group1Data = [
    { name: allText, y: [bkutData.statistics?.workersAmount] },
    { name: womenText, y: [bkutData.statistics?.workersFemale] },
    { name: adultsText, y: [bkutData.statistics?.workersAdults] },
  ];
  const group3Data = [
    { name: allText, y: [bkutData.statistics?.studentsAmount] },
    { name: womenText, y: [bkutData.statistics?.studentsFemale] },
    { name: adultsText, y: [bkutData.statistics?.studentsAdults] },
  ];
  const group4Data = [
    { name: allText, y: [bkutData.statistics?.pensionerAmount] },
  ];
  const group5Data = [
    { name: allText, y: [bkutData.statistics?.homemakerAmount] },
  ];
  const group6Data = [
    { name: allText, y: [bkutData.statistics?.invalidAmount] },
  ];

  const group7Data = [
    {
      name: t("statistical-information.input1"),
      y: [bkutData.statistics?.staffingAmount],
    },
    {
      name: t("statistical-information.input2"),
      y: [bkutData.statistics?.staffingWorkersAmount],
    },
    {
      name: t("statistical-information.input3"),
      y: [bkutData.statistics?.staffingResponsibleWorkers],
    },
    {
      name: t("statistical-information.input4"),
      y: [bkutData.statistics?.staffingTechnicalWorkers],
    },
  ];
  const group8Data = [
    {
      name: t("statistical-information.input5"),
      y: [bkutData.statistics?.salaryByAgreements],
    },
    {
      name: t("statistical-information.input6"),
      y: [bkutData.statistics?.spentAmount],
    },
    {
      name: t("statistical-information.input7"),
      y: [bkutData.statistics?.newMemebersAmount],
    },
    {
      name: t("statistical-information.input8"),
      y: [bkutData.statistics?.firedMembersAmount],
    },
    {
      name: t("statistical-information.input9"),
      y: [bkutData.statistics?.membersProvidedTicket],
    },
  ];
  const handleSubmit = async (forms, oldForms) => {
    try {
      if (!areEqual(forms, oldForms)) {
        setLoadingEditMode(true);
        await saveStatistics(forms);
        setLoadingEditMode(false);
        setIsChanged(false);
      }
    } catch (error) {
      // Handle any errors here
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
      <div ref={animRef} className={styles.containers}>
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
          {!editMode ? (
            <Button onClick={() => setEditMode(true)} startIcon={<EditIcon />}>
              {t("change")}
            </Button>
          ) : (
            <LoadingButton
              variant="contained"
              type="submit"
              // disabled={!isChanged}
              startIcon={<EditIcon />}
              loading={loadingEditMode}
            >
              {t("save")}
            </LoadingButton>
          )}
        </div>
        {!editMode ? (
          <div className={styles.grid}>
            <CardUI>
              <BarCharts
                categories={categories}
                title={t("statistical-information.group1")}
                data={group1Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                categories={categories}
                title={t("statistical-information.group3")}
                data={group3Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                title={t("statistical-information.group4")}
                data={group4Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                title={t("statistical-information.group5")}
                data={group5Data}
              />
            </CardUI>
            <CardUI>
              <BarCharts
                title={t("statistical-information.group6")}
                data={group6Data}
              />
            </CardUI>
            <CardUI>
              <PieCharts
                title={t("statistical-information.group7")}
                data={group7Data}
              />
            </CardUI>
            <CardUI className="full-grid-item">
              <BarCharts
                width={1000}
                title={t("statistical-information.group8")}
                data={group8Data}
              />
            </CardUI>
            <CardUI
              value={
                <CheckedBox
                  value={bkutData.statistics?.isProvidedPrivateRoom}
                />
              }
              label={t("statistical-information.input10")}
            />
            <CardUI
              value={<CheckedBox value={bkutData.statistics?.isProvidedPC} />}
              label={t("statistical-information.input11")}
            />
            <CardUI
              value={
                <CheckedBox value={bkutData.statistics?.isProvidedInternet} />
              }
              label={t("statistical-information.input12")}
            />
            <CardUI
              value={
                <CheckedBox value={bkutData.statistics?.isCollegialPresident} />
              }
              label={t("statistical-information.input13")}
            />
            <CardUI
              value={
                <CheckedBox value={bkutData.statistics?.isFiredFromMainJob} />
              }
              label={t("statistical-information.input14")}
            />
            <CardUI
              value={
                <CheckedBox
                  value={bkutData.statistics?.isProvidedPaidApparatus}
                />
              }
              label={t("statistical-information.input15")}
            />
          </div>
        ) : (
          <EditData />
        )}
      </div>
    </FormValidation>
  );
}

function CheckedBox({ value }) {
  return value ? (
    <CheckBoxIcon className="big-icon" />
  ) : (
    <CheckBoxOutlineBlankIcon className="big-icon" />
  );
}

<EditData />;

StatisticalInformation.layout = function (Component, t) {
  return (
    <HomeWrapper
      title={t("statistical-information.title")}
      desc={t("profile-page.desc")}
    >
      {Component}
    </HomeWrapper>
  );
};
