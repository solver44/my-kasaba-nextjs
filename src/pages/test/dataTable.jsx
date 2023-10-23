import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import styles from "./members.module.scss";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { getFIO, splitFIO } from "@/utils/data";
import { useSelector } from "react-redux";
import { fetchMember, sendMember } from "@/http/data";
import CheckBoxGroup from "@/components/CheckBoxGroup";
import useActions from "@/hooks/useActions";
import { showYesNoDialog } from "@/utils/dialog";
import RadioGroup from "@/components/RadioGroup";
import useDynamicData from "@/hooks/useDynamicData";

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
      field: "isHomemaker",
      type: "boolean",
      headerName: t("isHomemaker"),
    },
    {
      field: "isInvalid",
      type: "boolean",
      headerName: t("isInvalid"),
    },
    {
      field: "isPensioner",
      type: "boolean",
      headerName: t("isPensioner"),
    },
    {
      field: "isStudent",
      type: "boolean",
      headerName: t("isStudent"),
    },
  ];

  useEffect(() => {
    if (!bkutData?.members?.length) return;
    setRows(
      bkutData?.members.map((e) => {
        return {
          id: e.id,
          fio: getFIO(e.member),
          signDate: e.joinDate,
          isHomemaker: e.isHomemaker,
          isInvalid: e.isInvalid,
          isPensioner: e.isPensioner,
          isStudent: e.isStudent,
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
          ...forms.personInfo,
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
      onSubmitModal={onSubmitModal}
      isFormModal
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
  const [isMember, setIsMember] = useState(0);
  const [positions] = useDynamicData({ positions: true });
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
    setFormData({ fio: FIO, birthDate: "" });
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
      <RadioGroup
        left
        value={0}
        contained
        name="isMember"
        label={t("isMember")}
        onChange={(e) => {
          // console.log(e.target.value);
          setIsMember(e.target.value);
        }}
        data={[
          {
            value: "1",
            label: t("memberYes"),
          },
          {
            value: "0",
            label: t("memberNo"),
          },
        ]}
      />
      <div className="modal-row">
        <FinderPINFL
          disablePINFL
          pinflValue={member.pinfl}
          onFetch={onFetchPINFL}
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
        <FormInput
          select
          required
          value={1}
          name="gender"
          dataSelect={[
            { value: 1, label: t("man") },
            { value: 0, label: t("woman") },
          ]}
          label={t("gender")}
        />
      </div>
      <div className="modal-row">
        <FormInput value={phone} label={t("phone-number")} name="phoneNumber" />
        <FormInput value={email} label={t("employees.email")} name="email" />
      </div>
      <div className="modal-row">
        <FormInput
          select
          required
          value={position?.id}
          name="position"
          dataSelect={positions}
          label={t("job-position")}
        />
        <FormInput
          label={t("employment")}
          select
          multiple
          required
          dataSelect={[
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
            {
              value: "isWorker",
              label: t("worker"),
            },
          ]}
        />
      </div>
      {isMember == 1 && (
        <FormInput
          date
          label={t("employees.dateSign")}
          value={joinDate ? dayjs(joinDate) : null}
          required
          name="signDate"
          // value={formData.signDate}
        />
      )}
    </div>
  );
}
