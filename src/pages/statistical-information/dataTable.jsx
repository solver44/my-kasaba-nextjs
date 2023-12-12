import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { Alert, Box } from "@mui/material";
import FinderSTIR from "@/components/FinderSTIR";
import { useSelector } from "react-redux";
import { sendStatistics } from "@/http/data";
import useActions from "@/hooks/useActions";
import Group from "@/components/Group";
import RadioGroup from "@/components/RadioGroup";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const columns = [
    {
      field: "date",
      headerName: "statistical-information.date",
    },
    {
      field: "total",
      headerName: "statistical-information.total",
    },
    { field: "ku", headerName: "statistical-information.ku" },
    {
      field: "student",
      headerName: "statistical-information.student",
    },
    {
      field: "direktor",
      headerName: "statistical-information.direktor",
    },
    {
      field: "kuStudent",
      headerName: "statistical-information.kuStudent",
    },
    {
      field: "adr",
      headerName: t("statistical-information.adr"),
    },
    {
      field: "pesioners",
      headerName: t("statistical-information.pesioners"),
    },
    {
      field: "shtat",
      headerName: t("statistical-information.shtat"),
    },
  ];

  // useEffect(() => {
  //   if (!bkutData?.statistics?.length) return;
  //   setRows(
  //     bkutData.statistics
  //       .map((e) => {
  //         return {
  //           id: e.id,
  //           total: e.name,
  //           address: e.address,
  //         };
  //       })
  //   );
  // }, [bkutData]);

  async function onSubmitModal(forms, hideModal, isView) {
     sendData(forms, hideModal);
  }

  async function sendData(forms, hideModal) {
    const requestData = {
      bkut: {
        id: bkutData.id,
      },
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
      createdDate: forms.createdDate,
      studentsFemaleMembers: forms.studentsFemaleMembers,
      invalidAmount: forms.invalidAmount,
      salaryByAgreements: forms.salaryByAgreements,
      spentAmount: forms.spentAmount,
      workersFemaleMembers: forms.workersFemaleMembers,
      workersAdultsMembers: forms.workersAdultsMembers,
      staffingAmount: forms.staffingAmount,
      isProvidedPrivateRoom: forms.isProvidedPrivateRoom,
      isProvidedPC: forms.isProvidedPC,
      isProvidedInternet: forms.isProvidedInternet,
      isProvidedPaidApparatus: forms.isProvidedPaidApparatus,
      isFiredFromMainJob: forms.isFiredFromMainJob,
      isCollegialPresident: forms.isCollegialPresident,
      isProvidedPrivateRoom: forms.isProvidedPrivateRoom,
    };
    const response = await sendStatistics(requestData);
    if (response?.success) {
      const newId = rows[Math.max(rows.length - 1, 0)]?.id ?? 0;
      setRows((rows) => [
        ...rows.filter((r) => r.id != newId),
        { id: newId, ...forms },
      ]);
      enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      actions.updateData();
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    hideModal();
  }

  async function fetchData(id) {
    const data = (bkutData.organizations ?? []).find((ok) => ok.id == id);
    return data;
  }
  function deleteRow(id) {
    setRows((rows) => rows.filter((row) => row?.id != id));
  }

  return (
    <DataTable
      fetchData={fetchData}
      handleDeleteClick={deleteRow}
      columns={columns}
      title={t("statistical-information.title")}
      rows={rows}
      onSubmitModal={onSubmitModal}
      isFormModal
      fullModal
      modal={(hideModal, dataModal) => (
        <ModalUI hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}
function ModalUI({ hideModal, data }) {
  const { bkutData = {} } = useSelector((states) => states);
  const [values, setValues] = useState({
    workersAdults: "",
    workersFemale: "",
    firedMembersAmount: "",
    staffingResponsibleWorkers: "",
    homemakerAmount: "",
    staffingTechnicalWorkers: "",
    newMemebersAmount: "",
    pensionerAmount: "",
    studentsFemale:"",
    workersMembers: "",
    staffingWorkersAmount: "",
    workersAmount: "",
    membersProvidedTicket:"",
    studentsAdultsMembers: "",
    studentsAmount:"",
    studentsAdults: "",
    studentsMembers: "",
    studentsFemaleMembers: "", 
    invalidAmount:"",
    salaryByAgreements:"",
    spentAmount: "",
    workersFemaleMembers: "",
    workersAdultsMembers: "",
    staffingAmount:"",
    isProvidedPC: false,
    isProvidedInternet: false,
    isProvidedPaidApparatus: false,
    isFiredFromMainJob: false,
    isCollegialPresident: false,
    isProvidedPrivateRoom: false,
  });
  const { t } = useTranslation();
  const { tin } = data;

  const radioData = [
    {
      value: 'true',
      label: t("yes"),
    },
    {
      value: 'false',
      label: t("no"),
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      setValues((values) => ({
        ...values,
        workersAdults: data.workersAdults,
        workersFemale: data.workersFemale,
        firedMembersAmount: data.firedMembersAmount,
        staffingResponsibleWorkers: data.staffingResponsibleWorkers,
        homemakerAmount: data.homemakerAmount,
        staffingTechnicalWorkers: data.staffingTechnicalWorkers,
        newMemebersAmount: data.newMemebersAmount,
        pensionerAmount: data.pensionerAmount,
        studentsFemale:data.studentsFemale,
        workersMembers: data.workersMembers,
        staffingWorkersAmount: data.staffingWorkersAmount,
        workersAmount: data.workersAmount,
        membersProvidedTicket:data.membersProvidedTicket,
        studentsAdultsMembers: data.studentsAdultsMembers,
        studentsAmount:data.studentsAmount,
        studentsAdults: data.studentsAdults,
        studentsMembers: data.studentsMembers,
        studentsFemaleMembers: data.studentsFemaleMembers, 
        invalidAmount:data.invalidAmount,
        salaryByAgreements:data.salaryByAgreements,
        spentAmount: data.spentAmount,
        workersFemaleMembers: data.workersFemaleMembers,
        workersAdultsMembers: data.workersAdultsMembers,
        staffingAmount:data.staffingAmount,
        isProvidedPC: data.isProvidedPC,
        isProvidedInternet: data.isProvidedInternet,
        isProvidedPaidApparatus: data.isProvidedPaidApparatus,
        isFiredFromMainJob: data.isFiredFromMainJob,
        isCollegialPresident: data.isCollegialPresident,
        isProvidedPrivateRoom: data.isProvidedPrivateRoom,
      }));
    };
    fetchData();
  }, [data]);
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };
  return (
    <div className="modal-content">
         {/* <FormInput
          name="enterDate"
          required
          date
          label={t("statistical-information.signDate")}
        /> */}
        <div className="modal-row">
          <Group title={t("statistical-information.group1")}>
            <div datatype="list">
              <FormInput
                name="workersAmount"
                required
                value={values.workersAmount}
                type="number"
                label={t("statistical-information.all")}
                onChange={handleInputChange}
              />
              <FormInput
                name="workersFemale"
                required
                value={values.workersFemale}
                type="number"
                label={t("statistical-information.women")}
                onChange={handleInputChange}
              />
              <FormInput
                name="workersAdults"
                required
                value={values.workersAdults}
                type="number"
                label={t("statistical-information.adults")}
                onChange={handleInputChange}
              />
            </div>
          </Group>
          
          <Group title={t("statistical-information.group2")}>
            <div datatype="list">
              <FormInput
                name="workersMembers"
                required
                value={values.workersMembers}
                type="number"
                label={t("statistical-information.all")}
                onChange={handleInputChange}
              />
              <FormInput
                name="workersFemaleMembers"
                required
                value={values.workersFemaleMembers}
                type="number"
                label={t("statistical-information.women")}
                onChange={handleInputChange}
              />
              <FormInput
                name="workersAdultsMembers"
                required
                value={values.workersAdultsMembers}
                type="number"
                label={t("statistical-information.adults")}
                onChange={handleInputChange}
              />
            </div>
          </Group>
        </div>
        <div className="modal-row">
          <Group title={t("statistical-information.group3")}>
            <div datatype="list">
              <FormInput
                name="studentsAmount"
                required
                value={values.studentsAmount}
                type="number"
                label={t("statistical-information.all")}
                onChange={handleInputChange}
              />
              <FormInput
                name="studentsFemale"
                required
                value={values.studentsFemale}
                type="number"
                label={t("statistical-information.women")}
                onChange={handleInputChange}
              />
              <FormInput
                name="studentsAdults"
                required
                value={values.studentsAdults}
                type="number"
                label={t("statistical-information.adults")}
                onChange={handleInputChange}
              />
            </div>
          </Group>
          <Group title={t("statistical-information.group2")}>
            <div datatype="list">
              <FormInput
                name="studentsMembers"
                required
                value={values.studentsMembers}
                type="number"
                label={t("statistical-information.all")}
                onChange={handleInputChange}
              />
              <FormInput
                name="studentsFemaleMembers"
                required
                value={values.studentsFemaleMembers}
                type="number"
                label={t("statistical-information.women")}v
                onChange={handleInputChange}
              />
              <FormInput
                name="studentsAdultsMembers"
                required
                value={values.studentsAdultsMembers}
                type="number"
                label={t("statistical-information.adults")}
                onChange={handleInputChange}
              />
            </div>
          </Group>
        </div>
  
        <Group title={t("statistical-information.group4")}>
          <div datatype="list">
            <FormInput
              name="pensionerAmount"
              required
              value={values.pensionerAmount}
              type="number"
              label={t("statistical-information.all")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
        <div className="modal-row">
          <Group title={t("statistical-information.group5")}>
            <div datatype="list">
              <FormInput
                name="homemakerAmount"
                required
                value={values.homemakerAmount}
                type="number"
                label={t("statistical-information.all")}
                onChange={handleInputChange}
              />
            </div>
          </Group>
          <Group title={t("statistical-information.group6")}>
            <div datatype="list">
              <FormInput
                name="invalidAmount"
                required
                value={values.invalidAmount}
                type="number"
                label={t("statistical-information.all")}
                onChange={handleInputChange}
              />
            </div>
          </Group>
        </div>
        <Group title={t("statistical-information.group7")}>
          <div datatype="list">
            <FormInput
              name="staffingAmount"
              required
              value={values.staffingAmount}
              type="number"
              label={t("statistical-information.input1")}
              onChange={handleInputChange}
            />
            <FormInput
              name="staffingResponsibleWorkers"
              required
              value={values.staffingWorkersAmount}
              type="number"
              label={t("statistical-information.input2")}
              onChange={handleInputChange}
            />
          </div>
          <div datatype="list">
            <FormInput
              name="staffingResponsibleWorkers"
              required
              value={values.staffingResponsibleWorkers}
              type="number"
              label={t("statistical-information.input3")}
              onChange={handleInputChange}
            />
            <FormInput
              name="staffingTechnicalWorkers"
              required
              value={values.staffingTechnicalWorkers}
              type="number"
              label={t("statistical-information.input4")}
              onChange={handleInputChange}
            />
          </div>
        </Group>
        <Group title={t("statistical-information.group8")}>
          <div datatype="list">
            <FormInput
              name="salaryByAgreements"
              required
              value={values.salaryByAgreements}
              type="number"
              label={t("statistical-information.input5")}
              onChange={handleInputChange}
            />
            <FormInput
              name="spentAmount"
              required
              value={values.spentAmount}
              type="number"
              label={t("statistical-information.input6")}
              onChange={handleInputChange}
            />
            <FormInput
              name="newMemebersAmount"
              required
              value={values.newMemebersAmount}
              type="number"
              label={t("statistical-information.input7")}
              onChange={handleInputChange}
            />
            <FormInput
              name="firedMembersAmount"
              required
              value={values.firedMembersAmount}
              type="number"
              label={t("statistical-information.input8")}
              onChange={handleInputChange}
            />
            <FormInput
              name="membersProvidedTicket"
              required
              value={values.membersProvidedTicket}
              type="number"
              label={t("statistical-information.input9")}
              onChange={handleInputChange}
            />
            <div style={{ marginTop: 20 }} className="modal-row radio">
              <RadioGroup
                value={values.isProvidedPrivateRoom}
                name="isProvidedPrivateRoom"
                label={t("statistical-information.input10")}
                onChange={handleInputChange}
                data={radioData}
              />
              <RadioGroup
                value={values.isProvidedPC}
                name="isProvidedPC"
                label={t("statistical-information.input11")}
                data={radioData}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-row radio">
              <RadioGroup
                value={values.isProvidedInternet}
                name="isProvidedInternet"
                label={t("statistical-information.input12")}
                data={radioData}
                onChange={handleInputChange}
              />
              <RadioGroup
                value={values.isCollegialPresident}
                name="isCollegialPresident"
                label={t("statistical-information.input13")}
                data={radioData}
                onChange={handleInputChange}
              />
            </div>
            <div className="modal-row radio">
              <RadioGroup
                value={values.isFiredFromMainJob}
                name="isFiredFromMainJob"
                label={t("statistical-information.input14")}
                data={radioData}
                onChange={handleInputChange}
              />
              <RadioGroup
                value={values.isProvidedPaidApparatus}
                name="isProvidedPaidApparatus"
                label={t("statistical-information.input15")}
                data={radioData}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </Group>
      </div>
  );
}