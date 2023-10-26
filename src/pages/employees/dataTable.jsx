import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { getPositions, sendEmployee } from "@/http/data";
import { useSelector } from "react-redux";
import {
  POSITIONS,
  getFIO,
  getLocLabel,
  getLocalizationNames,
  splitFIO,
} from "@/utils/data";
import { convertStringToFormatted } from "@/utils/date";
import dayjs from "dayjs";
import useActions from "@/hooks/useActions";
import { showYesNoDialog } from "@/utils/dialog";
import useDynamicData from "@/hooks/useDynamicData";

export default function InDataTable({ onUpload, min }) {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const { bkutData = {} } = useSelector((states) => states);
  const actions = useActions();
  const [positions] = useDynamicData({ positions: true });

  const columns = [
    { field: "fio", headerName: "fio", size: 300 },
    {
      field: "position",
      headerName: "job-position",
      tooltip: (positions || []).reduce((data, current) => {
        const result = `${current.value} - ${getLocLabel(current)}\n`;
        return data + result;
      }, ""),
    },
    { field: "birthDate", headerName: "birth-date", hidden: true },
    { field: "phoneNumber", headerName: "phone-number" },
    { field: "email", headerName: "email" },
  ];

  useEffect(() => {
    if (!bkutData?.employees?.length) return;
    setRows(
      bkutData?.employees.map((e) => {
        return {
          id: e.employee.id,
          fio: getFIO(e.employee),
          position: getLocalizationNames(e.position, i18n),
          // position: {
          //   label: getLocalizationNames(e.position, i18n),
          //   value: e.position.id,
          // },
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

  async function onSubmitModal(forms, hideModal, isView) {
    if (
      !isView &&
      (bkutData?.employees ?? []).find((e) => e.employee.pinfl == forms.pinfl)
    ) {
      showYesNoDialog(
        t("rewrite-pinfl"),
        () => sendData(forms, hideModal, true),
        () => {},
        t
      );
      return;
    }
    sendData(forms, hideModal, isView);
  }

  async function sendData(forms, hideModal, isView, noAlert) {
    const fio = splitFIO(forms.fio);
    const requestData = {
      bkutId: bkutData.id,
      pinfl: forms.pinfl,
      fio: forms.fio,
      firstName: fio[0],
      lastName: fio[1],
      middleName: fio[2],
      phone: forms.phoneNumber,
      email: forms.email,
      birthDate: forms.birthDate,
      position: forms.position,
    };
    const employees = (bkutData.employees ?? []).filter((e) =>
      isView ? e.employee.pinfl != forms.pinfl : true
    );
    const response = await sendEmployee(requestData, employees);
    if (response?.success) {
      const newId = rows[Math.max(rows.length - 1, 0)]?.id ?? 0;
      setRows((rows) => [
        ...rows.filter((r) => r.id != newId),
        { id: newId, ...forms },
      ]);
      if (!noAlert)
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      actions.updateData();
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    if (hideModal) hideModal();
  }

  async function fetchData(id) {
    const data = (bkutData.employees ?? []).find((e) => e.employee.id == id);
    return data;
  }
  function deleteRow(id) {
    setRows((rows) => rows.filter((row) => row?.id != id));
  }
  async function onImportRow(rowData) {
    const forms = {
      ...rowData,
    };
    return await sendData(forms, null, false, true);
  }

  return (
    <DataTable
      fetchData={fetchData}
      handleDeleteClick={deleteRow}
      columns={columns}
      onImportRow={onImportRow}
      rows={rows}
      bkutData={bkutData}
      min={min}
      title={t("employees.title1")}
      onSubmitModal={onSubmitModal}
      isFormModal
      modal={(hideModal, dataModal) => (
        <ModalUI positions={positions} hideModal={hideModal} data={dataModal} />
      )}
    />
  );
}

function ModalUI({ hideModal, positions, data = {} }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ fio: "", birthDate: "" });
  const { employee = {}, position = {}, phone, email } = data;

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data),
      birthDate: dayjs(data.birth_date),
    });
  }

  useEffect(() => {
    const FIO = getFIO(employee);
    if (!FIO) return;
    setFormData({
      fio: FIO,
      birthDate: dayjs(employee.birthDate ?? ""),
    });
  }, [data]);

  return (
    <div className="modal-content">
      <div className="modal-row">
        <FinderPINFL
          pinflValue={employee.pinfl}
          disablePINFL
          onFetch={onFetchPINFL}
        />
      </div>
      <div className="modal-row">
        <FormInput label={t("fio")} name="fio" required value={formData.fio} />
        <FormInput
          select
          required
          value={position.id}
          name="position"
          dataSelect={positions}
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
