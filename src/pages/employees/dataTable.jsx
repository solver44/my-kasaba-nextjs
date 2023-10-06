import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import { useSnackbar } from "notistack";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "fio", headerName: t("fio"), minWidth: 180 },
    { field: "position", headerName: t("job-position") },
    { field: "birthDate", headerName: t("birth-date"), minWidth: 150 },
    { field: "phoneNumber", headerName: t("phone-number"), minWidth: 180 },
    { field: "email", headerName: t("email"), minWidth: 200 },
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
  const [formData, setFormData] = useState({ fio: "", birthDate: "" });

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: `${data.first_name} ${data.last_name} ${data.middle_name}`,
      birthDate: dayjs(data.birth_date),
    });
  }

  return (
    <div className="modal-content">
      <div className="modal-row">
        <FinderPINFL onFetch={onFetchPINFL} />
      </div>
      <FormInput
        select
        name="position"
        dataSelect={[]}
        label={t("job-position")}
      />
      <div className="modal-row">
        <FormInput label={t("fio")} name="fio" required value={formData.fio} />
        <FormInput
          date
          label={t("birth-date")}
          required
          name="birthDate"
          value={formData.birthDate}
        />
      </div>
      <div className="modal-row">
        <FormInput label={t("phone-number")} name="phoneNumber" required />
        <FormInput label={t("email")} required name="email" />
      </div>
    </div>
  );
}
