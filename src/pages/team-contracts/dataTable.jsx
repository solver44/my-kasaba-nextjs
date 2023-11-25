import DataTable from "@/components/DataTable";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useEmployees } from "../employees";
import FormInput from "@/components/FormInput";

export default function InDataTable() {
  const { t } = useTranslation();
  const { bkutData = {} } = useSelector((states) => states);
  const [rows, setRows] = useState([
    {
      id: 1,
      contractNumber: "20.02.22",
      agreeDate: "02.02.2023",
      sign: "Mirzaev I.A.",
      signK: "Navoiy",
    },
    {
      id: 2,
      contractNumber: "20.02.22",
      agreeDate: "02.02.2023",
      sign: "Mirzaev I.A.",
      signK: "Navoiy",
    },
  ]);
  const columns = [
    { field: "contractNumber", headerName: t("team-contracts.contractNumber") },
    { field: "agreeDate", headerName: t("team-contracts.agreeDate") },
    { field: "sign", headerName: t("team-contracts.sign") },
    { field: "signK", headerName: t("team-contracts.signK") },
  ];

  async function onSubmitModal(forms, hideModal, isView) {

  }

  async function sendData(forms, hideModal) {
   
  }
  function updateRows(formData) {
    const newId = rows.length + 1;
    const newRow = { id: newId, ...formData };
    setRows((prevRows) => [...prevRows, newRow]);
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
      title={t("team-contracts.title")}
      columns={columns}
      rows={rows}
      hideImport
      bkutData={bkutData}
      onSubmitModal={onSubmitModal}
      isFormModal
      modal={(hideModal, dataModal) => (
        <ModalUI hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}

function ModalUI({ hideModal, data }) {
  const { t } = useTranslation();
  const [employees, bkutData] = useEmployees();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    // Add other form input state values here
  });
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = () => {
    updateRows(formData); // Call the updateRows function from props
    hideModal(); // Hide the modal after form submission
  };

  return (
    <div className="modal-content">
      <div className="modal-row">
        <FormInput
          name="contractNumber"
          label={t("team-contracts.contractNumber")}
        />
        <FormInput
          name="contractDate"
          date
          label={t("team-contracts.contractDate")}
        />
      </div>
      <div className="modal-row">
        <FormInput
            name="bkutPpo"
            required
            label={t("team-contracts.bkutPpo")}
          />
        <FormInput
          name="applicationNumber"
          required
          label={t("team-contracts.applicationNumber")}
        />
      </div>
      <FormInput
        name="companyName"
        required
        label={t("team-contracts.companyName")}
      />
      <div className="modal-row">
        <FormInput
          name="employer"
          required
          label={t("team-contracts.employer")}
        />
        <FormInput
          name="signDate"
          date
          label={t("team-contracts.signDate")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          name="director"
          required
          label={t("team-contracts.director")}
        />
         <FormInput
          name="signDate1"
          date
          label={t("team-contracts.signDate")}
        />
      </div>
     
      <FormInput
        name="application"
        required
        fileInput
        label={t("team-contracts.application")}
      />
    </div>
  );
}
