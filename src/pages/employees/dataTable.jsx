import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { sendEmployee } from "@/http/data";
import { useSelector } from "react-redux";
import { POSITIONS, getFIO, getLocalizationNames } from "@/utils/data";
import { convertStringToFormatted } from "@/utils/date";
import dayjs from "dayjs";
import useActions from "@/hooks/useActions";

export default function InDataTable({ onUpload, min }) {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { bkutData = {} } = useSelector((states) => states);
  const actions = useActions();

  const columns = [
    // { field: "id", headerName: "ID", width: 80 },
    { field: "fio", headerName: t("fio"), minWidth: 320 },
    { field: "position", headerName: t("job-position") },
    // { field: "birthDate", headerName: t("birth-date"), minWidth: 150 },
    { field: "phoneNumber", headerName: t("phone-number"), minWidth: 180 },
    { field: "email", headerName: t("email"), minWidth: 200 },
  ];

  useEffect(() => {
    if (!bkutData?.employees?.length) return;
    setRows(
      bkutData?.employees.map((e) => {
        return {
          id: e.employee.id,
          fio: `${e.employee.firstName} ${e.employee.lastName} ${e.employee.middleName}`,
          position: {
            label: getLocalizationNames(e.position, i18n),
            value: e.position.id,
          },
          birthDate: convertStringToFormatted(e.employee.birthDate),
          phoneNumber: e.employee.phone,
          email: e.employee.email,
        };
      })
    );
  }, [bkutData]);

  useEffect(() => {
    if (onUpload) onUpload({ columns, rows });
  }, [rows]);

  async function onSubmitModal(forms, hideModal) {
    const fio = forms.fio.split(" ");
    const requestData = {
      bkutId: bkutData.id,
      pinfl: forms.pinfl,
      lastName: fio[0],
      firstName: fio[1],
      middleName: fio[2],
      phone: forms.phoneNumber,
      email: forms.email,
      birthDate: forms.birthDate,
      position: forms.position,
    };
    const response = await sendEmployee(requestData);
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
    const data = (bkutData.employees ?? []).find((e) => e.employee.id == id);
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
      rows={rows}
      min={min}
      onSubmitModal={onSubmitModal}
      isFormModal
      modal={(hideModal, dataModal) => (
        <ModalUI hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}

function ModalUI({ hideModal, data = {} }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ fio: "", birthDate: "" });
  const { employee = {}, position = {}, birthDate, phone, email } = data;

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: `${data.first_name} ${data.last_name} ${data.middle_name}`,
      birthDate: dayjs(data.birth_date),
    });
  }

  useEffect(() => {
    const FIO = getFIO(employee);
    if (!FIO) return;
    setFormData({ fio: FIO, birthDate: birthDate ? dayjs(birthDate) : "" });
  }, [data]);

  return (
    <div className="modal-content">
      <div className="modal-row">
        <FinderPINFL pinflValue={employee.pinfl} onFetch={onFetchPINFL} />
      </div>
      <div className="modal-row">
        <FormInput label={t("fio")} name="fio" required value={formData.fio} />
        <FormInput
          select
          required
          value={position.id}
          name="position"
          dataSelect={POSITIONS(t)}
          label={t("job-position")}
        />
      </div>
      <FormInput
        date
        label={t("birth-date")}
        required
        name="birthDate"
        value={formData.birthDate}
      />
      <div className="modal-row">
        <FormInput value={phone} label={t("phone-number")} name="phoneNumber" />
        <FormInput value={email} label={t("email")} name="email" />
      </div>
    </div>
  );
}
