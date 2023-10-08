import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const columns = [
    { field: "id", headerName: "Kod", width: 1},
    { field: "fio", headerName: t("employess.fio"), width: 294 },
    { field: "dateSign", headerName: t("employess.dateSign"), minWidth: 195 },
    { field: "passNumber", headerName: t("employess.passNumber"), minWidth: 165 },
    { field: "position", headerName: t("employess.position"), minWidth: 195 },
    { field: "workPlace", headerName: t("employess.workPlace"), minWidth: 195 },
    { field: "phoneNumber", headerName: t("phone-number"), minWidth: 160 },
    { field: "email", headerName: t("employess.email"), minWidth: 167 },
   
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
      modal={(hideModal) => <ModalUI hideModal={hideModal} />
        }
    />
  );
}

function ModalUI({ hideModal }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ fio: "", birthDate: "" });

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: `${data.first_name} ${data.last_name} ${data.middle_name}`,
      birthDate: dayjs(data.birth_date),
    });
  }
  function hundleClose(){
    hideModal();
  }
  return (
    
    <div className="modal-content">
      <div className="modal-row">
        <FinderPINFL onFetch={onFetchPINFL} />
      </div>
      <div className="modal-row">
        <FormInput
            date
            label={t("employess.dateSign")}
            required
            name="dateSign"
            value={formData.birthDate}
          />
           <FormInput label={t("employess.passNumber")} name="passNumber" type="number" />
      </div>
        <FormInput
          select
          name="position"
          dataSelect={[]}
          label={t("employess.position")}
        />
        <FormInput
          select
          name="workPlace"
          dataSelect={[]}
          label={t("employess.workPlace")}
        />
         <FormInput label={t("fio")} name="fio" required value={formData.fio} />
      <div className="modal-row">
        <FormInput label={t("phone-number")} name="phoneNumber" />
        <FormInput label={t("employess.email")} name="email" />
      </div>
      <Button onClick={hundleClose} variant="contained" color="success">{t("createDoc")}</Button>
    </div>
  );
}