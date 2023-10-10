import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import styles from "./members.module.scss";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { POSITIONS } from "@/utils/data";
import { useSelector } from "react-redux";
import { sendMember } from "@/http/data";
import CheckBoxGroup from "@/components/CheckBoxGroup";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();

  const columns = [
    { field: "fio", headerName: t("employees.fio"), width: 294 },
    { field: "signDate", headerName: t("employees.dateSign"), minWidth: 195 },
    {
      field: "passportCertificate",
      headerName: t("employees.passNumber"),
      minWidth: 165,
    },
    { field: "birthDate", headerName: t("birth-date"), minWidth: 195 },
    { field: "position", headerName: t("employees.position"), minWidth: 195 },
    { field: "workPlace", headerName: t("employees.workPlace"), minWidth: 195 },
    { field: "phoneNumber", headerName: t("phone-number"), minWidth: 160 },
    { field: "email", headerName: t("employees.email"), minWidth: 167 },
  ];
  async function onSubmitModal(forms, hideModal) {
    const requestData = {
      id: bkutData.id,
      members: [
        {
          bkut: {
            id: bkutData.id,
          },
          member: {
            id: "?",
          },
          joinDate: forms.signDate,
          ...forms.personInfo,
        },
      ],
    };
    const fio = forms.fio.split(" ");
    const data = {
      bkutId: requestData.id,
      pinfl: forms.pinfl,
      lastName: fio[0],
      firstName: fio[1],
      middleName: fio[2],
    };
    const response = await sendMember(requestData, data);
    if (response?.success) {
      setRows((rows) => [
        ...rows,
        { id: rows[Math.max(rows.length - 1, 0)]?.id ?? 0, ...forms },
      ]);
      enqueueSnackbar(t("successfully-saved"), { variant: "success" });
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    hideModal();
  }

  function generateDoc() {}

  return (
    <DataTable
      columns={columns}
      rows={rows}
      onSubmitModal={onSubmitModal}
      isFormModal
      bottomModal={(handleSubmit, handleClose) => (
        <div className={styles.bottom}>
          <div className={styles.row}>
            <Button onClick={handleSubmit} variant="contained">
              {t("save")}
            </Button>
            <Button onClick={handleClose}>{t("close")}</Button>
          </div>
          <Button onClick={generateDoc} variant="contained" color="success">
            {t("createDoc")}
          </Button>
        </div>
      )}
      modal={(hideModal) => <ModalUI hideModal={hideModal} />}
    />
  );
}

function ModalUI({ hideModal }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
    signDate: "",
  });

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
      <div className="modal-row">
        <FormInput
          date
          label={t("employees.dateSign")}
          required
          name="signDate"
          // value={formData.signDate}
        />
        <FormInput
          required
          label={t("employees.passNumber")}
          name="passportCertificate"
        />
      </div>
      <div className="modal-row">
        <FormInput required label={t("fio")} name="fio" value={formData.fio} />
        <FormInput
          date
          label={t("birth-date")}
          required
          name="birthDate"
          value={formData.birthDate}
        />
      </div>
      <div className="modal-row">
        <FormInput required name="position" label={t("employees.position")} />
        <FormInput
          // select
          required
          name="workPlace"
          // dataSelect={[]}
          label={t("employees.workPlace")}
        />
      </div>
      <div className="modal-row">
        <FormInput label={t("phone-number")} required name="phoneNumber" />
        <FormInput label={t("employees.email")} required name="email" />
      </div>
      <CheckBoxGroup
        name="personInfo"
        data={[
          {
            value: "isStudent",
            label: t("isStudent"),
          },
          {
            value: "isPensioner",
            label: t("isPensioner"),
          },
          {
            value: "isHomemaker",
            label: t("isHomemaker"),
          },
          {
            value: "isInvalid",
            label: t("isInvalid"),
          },
        ]}
      />
    </div>
  );
}
