import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import styles from "./members.module.scss";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { POSITIONS, getFIO, splitFIO } from "@/utils/data";
import { useSelector } from "react-redux";
import { fetchMember, sendMember } from "@/http/data";
import CheckBoxGroup from "@/components/CheckBoxGroup";
import useActions from "@/hooks/useActions";
import { showYesNoDialog } from "@/utils/dialog";

export default function InDataTable() {
  const { t } = useTranslation();
  const [rows, setRows] = useState([]);
  const { bkutData = {} } = useSelector((states) => states);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const columns = [
    { field: "fio", headerName: t("employees.fio"), minWidth: 320 },
    { field: "signDate", headerName: t("employees.dateSign"), minWidth: 250 },
    {
      field: "employment",
      type: "chip",
      headerName: t("employment"),
      minWidth: 320,
    },
  ];

  function getEmployeement(member) {
    let result = [];
    if (member.isHomemaker) result.push(t("isHomemaker"));
    if (member.isInvalid) result.push(t("isInvalid"));
    if (member.isPensioner) result.push(t("isPensioner"));
    if (member.isStudent) result.push(t("isStudent"));

    return result;
  }

  useEffect(() => {
    if (!bkutData?.members?.length) return;
    setRows(
      bkutData?.members.map((e) => {
        return {
          id: e.id,
          fio: getFIO(e.member),
          signDate: e.joinDate,
          employment: getEmployeement(e),
        };
      })
    );
  }, [bkutData]);

  async function onSubmitModal(forms, hideModal, isView) {
    if (
      !isView &&
      (bkutData?.members ?? []).find((e) => e.member.pinfl == forms.pinfl)
    ) {
      showYesNoDialog(
        t("rewrite-pinfl-member"),
        () => sendData(forms, hideModal, true),
        () => {},
        t
      );
      return;
    }
    sendData(forms, hideModal, isView);
  }

  async function sendData(forms, hideModal, isView) {
    const members = (bkutData.members ?? [])
      .filter((e) => (isView ? e.member.pinfl != forms.pinfl : true))
      .map((e) => ({
        ...e,
        bkut: {
          id: bkutData.id,
        },
        member: {
          id: e.member.id,
        },
        joinDate: e.joinDate,
        position: e.position,
        phone: e.phoneNumber,
        email: e.email,
      }));
    const requestData = {
      id: bkutData.id,
      members: [
        {
          ...forms.personInfo,
          bkut: {
            id: bkutData.id,
          },
          member: {
            id: "?",
          },
          joinDate: forms.signDate,
          position: forms.position,
          phone: forms.phoneNumber,
          email: forms.email,
        },
      ],
    };
    const fio = splitFIO(forms.fio);
    const data = {
      bkutId: requestData.id,
      pinfl: forms.pinfl,
      firstName: fio[0],
      lastName: fio[1],
      middleName: fio[2],
      birthDate: forms.birthDate,
    };
    const response = await sendMember(requestData, data, members);
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

  function generateDoc() {}
  async function fetchData(id) {
    const data = (bkutData.members ?? []).find((member) => member.id == id);
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
      bkutData={bkutData}
      onSubmitModal={onSubmitModal}
      isFormModal
      modalWidth="80vw"
      bottomModal={(handleSubmit, handleClose, isView) => (
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
      modal={(hideModal, dataModal) => (
        <ModalUI data={dataModal} hideModal={hideModal} />
      )}
    />
  );
}

function ModalUI({ hideModal, data = {} }) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
  });
  const {
    id,
    position,
    phone,
    email,
    member = {},
    joinDate,
    _entityName,
    _instanceName,
    ...inData
  } = data;

  useEffect(() => {
    const FIO = getFIO(data.member);
    if (!FIO) return;
    setFormData({ fio: FIO, birthDate: dayjs(member.birthDate ?? "") });
  }, [data]);

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data),
      birthDate: dayjs(data.birth_date),
    });
  }
  return (
    <div className="modal-content">
      <div className="modal-row">
        <FinderPINFL
          disablePINFL
          pinflValue={member.pinfl}
          onFetch={onFetchPINFL}
        />
      </div>
      <div className="modal-row">
        <FormInput
          date
          label={t("employees.dateSign")}
          value={joinDate ? dayjs(joinDate) : null}
          required
          name="signDate"
          // value={formData.signDate}
        />
        <FormInput
          required
          value={position}
          name="position"
          label={t("employees.position")}
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
        <FormInput value={phone} label={t("phone-number")} name="phoneNumber" />
        <FormInput value={email} label={t("employees.email")} name="email" />
      </div>
      <CheckBoxGroup
        name="personInfo"
        value={inData}
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
