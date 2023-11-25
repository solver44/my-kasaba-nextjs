import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import {
  deleteEmployee,
  deleteMember,
  getPositions,
  sendEmployee,
  sendMember,
} from "@/http/data";
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
import RadioGroup from "@/components/RadioGroup";
import useAnimation from "@/hooks/useAnimation";
import CheckBoxGroup from "@/components/CheckBoxGroup";

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
          id: e?.employee?.id,
          employeeID: e.id,
          fio: getFIO(e.employee),
          position: getLocalizationNames(e.position, i18n),
          birthDate: convertStringToFormatted(e.employee?.birthDate),
          phoneNumber: e.phone,
          email: e.email,
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

  async function sendMemberData(forms) {
    const members = (bkutData.members ?? [])
      .filter((e) => e.member.pinfl != forms.pinfl)
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
          ...forms.employment,
          bkut: {
            id: bkutData.id,
          },
          member: {
            id: "?",
          },
          joinDate: forms.signDate,
          position: positions.find((p) => p.value == forms.position).label,
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
    await sendMember(requestData, data, members);
  }
  async function deleteMemberData(forms) {
    const currentMember = (bkutData.members ?? []).find(
      (e) => e.member.pinfl == forms.pinfl
    );
    if (!currentMember) return;
    await deleteMember(currentMember.id);
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
      if (!noAlert) {
        if (forms.isMember == 1) await sendMemberData(forms);
        else await deleteMemberData(forms);
        enqueueSnackbar(t("successfully-saved"), { variant: "success" });
      } else return true;

      actions.updateData();
    } else {
      enqueueSnackbar(t("error-send-bkut"), { variant: "error" });
    }
    if (noAlert) return false;
    if (hideModal) hideModal();
  }

  async function fetchData(id) {
    const employee = (bkutData.employees ?? []).find(
      (e) => e.employee.id == id
    );
    const currentMember = (bkutData.members ?? []).find(
      (e) => e.member.pinfl == employee.employee.pinfl
    );
    const data = {
      ...(currentMember ?? {}),
      ...employee,
      isFired: !!!currentMember,
    };
    data.employment = {
      isHomemaker: !!data.isHomemaker,
      isInvalid: !!data.isInvalid,
      isPensioner: !!data.isPensioner,
      isStudent: !!data.isStudent,
    };
    return data;
  }
  async function deleteRow(id, row) {
    const res = await deleteEmployee(row.employeeId);
    if (res) {
      setRows((rows) => rows.filter((row) => row?.id != id));
      actions.updateData();
    } else enqueueSnackbar(t("delete-error"), { variant: "error" });
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
      modalWidth="80vw"
      title={t("employees.title")}
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
  const [isMember, setIsMember] = useState(true);
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
    gender: 1,
  });
  const {
    employee = {},
    position = {},
    employment = {},
    joinDate,
    phone,
    isFired = false,
    email,
  } = data;
  const animRef = useAnimation();

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data.profile),
      birthDate: dayjs(data.profile.birth_date),
      gender: data.profile.gender != 1 ? 0 : 1,
    });
  }

  useEffect(() => {
    const FIO = getFIO(employee);
    if (!FIO) return;
    setFormData({
      fio: FIO,
      birthDate: employee.birthDate ? dayjs(employee.birthDate) : "",
      gender: employee.gender ?? formData.gender,
    });
  }, [data]);

  return (
    <div ref={animRef} className="modal-content">
      <FinderPINFL
        pinflValue={employee.pinfl}
        disablePINFL
        onFetch={onFetchPINFL}
      />
      <div className="modal-row">
        <FormInput
          disabled
          label={t("fio")}
          name="fio"
          required
          value={formData.fio}
        />

        <FormInput
          select
          required
          value={formData.gender}
          name="gender"
          disabled
          dataSelect={[
            { value: 1, label: t("man") },
            { value: 0, label: t("woman") },
          ]}
          label={t("gender")}
        />
      </div>
      <div className="modal-row">
        <FormInput
          date
          disabled
          label={t("birth-date")}
          required
          name="birthDate"
          value={formData.birthDate}
        />
        <FormInput
          select
          value={position.id}
          name="position"
          dataSelect={positions}
          label={t("job-position")}
        />
        <FormInput
          date
          label={t("employees.dateSign")}
          value={joinDate ? dayjs(joinDate) : null}
          name="signDate"
          // value={formData.signDate}
        />
      </div>
      <div className="modal-row">
        <FormInput value={phone} label={t("phone-number")} name="phoneNumber" />
        <FormInput value={email} label={t("email")} name="email" />
      </div>
      <div className="modal-row">
        <CheckBoxGroup
          name="employment"
          value={employment}
          data={[
            {
              value: "isStudent",
              label: t("isStudent"),
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
        <RadioGroup
          left
          defaultValue={1}
          value={isFired ? 0 : 1}
          name="isMember"
          label={t("isFired")}
          onChange={(e) => {
            setIsMember(e.target.value);
          }}
          data={[
            {
              value: "0",
              label: t("yes"),
            },
            {
              value: "1",
              label: t("no"),
            },
          ]}
        />
      </div>
    </div>
  );
}
