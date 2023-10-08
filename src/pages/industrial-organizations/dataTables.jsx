import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { Box } from "@mui/material";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const columns = [
    { field: "id", headerName: "Kod", width: 102 },
    { field: "name", headerName: t("industrial-organizations.name"), minWidth: 200 },
    { field: "worker", headerName: t("industrial-organizations.worker"), minWidth: 79 },
    { field: "statistic", headerName: t("industrial-organizations.statistic"), minWidth: 79 },
    { field: "direktor", headerName: t("industrial-organizations.direktor"), minWidth: 150 },
    { field: "firstorg", headerName: t("industrial-organizations.firstorg"), minWidth: 130 },
    { field: "tel", headerName: t("industrial-organizations.tel"), minWidth: 110 },
    { field: "soato", headerName: t("industrial-organizations.soato"), minWidth: 100 },
    { field: "adr", headerName: t("industrial-organizations.adr"), minWidth: 110 },
    { field: "okpo", headerName: t("industrial-organizations.okpo"), minWidth: 70 },
    { field: "type", headerName: t("industrial-organizations.type"), minWidth: 110 },
  ];
  function onSubmitModal(forms, hideModal) {
    setRows((rows) => [
      ...rows,
      { id: rows[Math.max(rows.length - 1, 0)]?.id ?? 0, ...forms },
    ]);
    enqueueSnackbar(t("successfully-saved"), { variant: "success" });
    hideModal();
  }

  return (
    <DataTable
      columns={columns}
      rows={rows}
      onSubmitModal={onSubmitModal}
      isFormModal
      modal={(hideModal) => <ModalUI hideModal={hideModal} />}
    />
  );
}
function ModalUI({ hideModal }) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: 720,
        height: 720,
      }}
    >
    <div className="modal-content">
      
      <FormInput
        select
        name="name"
        dataSelect={["Buxoro MCHJ"]}
        label={t("industrial-organizations.name")}
      />
        <FormInput label={t("industrial-organizations.worker")} name="worker" required />
        <FormInput label={t("industrial-organizations.statistic")} name="statistic" required />
        <FormInput label={t("industrial-organizations.direktor")} name="direktor" required />
        <FormInput label={t("industrial-organizations.firstorg")} required name="firstorg" />
      <div className="modal-row">
        <FormInput label={t("phone-number")} name="phoneNumber" required />
        <FormInput
        select
        name="soato"
        dataSelect={["Buxoro MCHJ"]}
        label={t("industrial-organizations.soato")}
      />
      </div>
      <FormInput label={t("industrial-organizations.adr")} required name="adr" />
      <div className="modal-row">
      <FormInput label={t("industrial-organizations.okpo")} name="industrial-organizations.okpo" required />
        <FormInput
        select
        name="type"
        dataSelect={["Buxoro MCHJ"]}
        label={t("industrial-organizations.type")}
      />
      </div>
    </div></Box>
  );
}
