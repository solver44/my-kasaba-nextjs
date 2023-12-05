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
import { BKUT_DATA } from "@/store/actions";

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
      bkutData?.employees.filter((e) => e.isKasabaActive !== false) // Filter out rows where isKasabaActive is false
      .map((e) => {
        return {
          id: e?.individual?.id,
          employeeID: e.id,
          fio: getFIO(e.individual),
          position: getLocalizationNames(e.position, i18n),
          birthDate: convertStringToFormatted(e.individual?.birthDate),
          phoneNumber: e.individual.phone,
          email: e.individual.email,
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
      (bkutData?.employees ?? []).find((e) => e.individual.pinfl == forms.pinfl)
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
    console.log(bkutData)
    const isMemberValue = forms.isMember === "true";
    const isKasabaActives = forms.isKasabaActive === "true";
    const members = (bkutData.employees ?? [])
      .filter((e) => e.individual.pinfl != forms.pinfl)
      .map((e) => ({
        ...e,
        bkut: {
          id: bkutData.id,
        },
        individual: {
          id: e.pinfl, // Use the pinfl when searching
          phone: e.phoneNumber,
          email: e.email,
        },
        isKasabaActive: true, // Example values, replace with your logic
        isHomemaker: e.isHomemaker || false,
        isMember: e.isMember || false,
        isInvalid: e.isInvalid || false,
        isPensioner: false, // Example value, replace with your logic
        isStudent: e.isStudent || false,
        position: {
          id: e.position, // Use the lavozim id
        },
        memberJoinDate: e.signDate, // Use the join date
      }));
      const requestData = {
        bkut: {
          id: bkutData.id,
        },
        individual: {
          id: forms.pinfl, // Use the pinfl when searching
          phone: forms.phoneNumber,
          email: forms.email,
        },
        isKasabaActive: isKasabaActives, // Example values, replace with your logic
        isHomemaker: forms.isHomemaker || false,
        isMember: isMemberValue || false,
        isInvalid: forms.isInvalid || false,
        isPensioner: false, // Example value, replace with your logic
        isStudent: forms.isStudent || false,
        position: {
          id: forms.position, // Use the lavozim id
        },
        memberJoinDate: forms.signDate, // Use the join date
      };
    const fio = splitFIO(forms.fio);
    
    const data = {
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
      isStudent: forms.employment.isStudent,
      isHomemaker: forms.employment.isHomemaker,
      isPensioner: forms.employment.isPensioner,
      isInvalid: forms.employment.isInvalid,
      isMember: isMemberValue,
      isKasabaActive: isKasabaActives,
      memberJoinDate: forms.signDate,
    };
    console.log(data)
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
    const isMemberValue = forms.isMember === "true";
    const isKasabaActives = forms.isKasabaActive === "true";
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
      isStudent: forms.employment.isStudent,
      isHomemaker: forms.employment.isHomemaker,
      isPensioner: forms.employment.isPensioner,
      isInvalid: forms.employment.isInvalid,
      isMember: isMemberValue,
      isKasabaActive: isKasabaActives,
      memberJoinDate: forms.signDate,
    };
    
    const employees = (bkutData.employees ?? []).filter((e) =>
      isView ? e.individual.pinfl != forms.pinfl : true
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
    const individual = (bkutData.employees ?? []).find(
      (e) => e.individual.id == id
    );
    const currentMember = (bkutData.employees ?? []).find(
      (e) => e.individual.pinfl == individual.pinfl
    );
    const data = {
      ...(currentMember ?? {}),
      ...individual,
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
    const employeeId = row.employeeID; // Retrieve employee ID from the 'row' object
  
    if (!employeeId) {
      console.error('Invalid or missing employee ID:', employeeId);
      // Handle the scenario where the ID is missing or undefined
      return;
    }
  
    try {
      const res = await deleteEmployee(employeeId);
      if (res) {
        setRows((rows) => rows.filter((r) => r?.id !== id));
        actions.updateData();
      } else {
        enqueueSnackbar(t("delete-error"), { variant: "error" });
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      enqueueSnackbar(t("delete-error"), { variant: "error" });
    }
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
      hideFirstButton
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
  const [mode, setMode] = useState(0);
  const [formData, setFormData] = useState({
    fio: "",
    birthDate: "",
    gender: 1,
    phoneNumber: "",
    email: "",
    signDate: "",
  });
  const {
    individual = {},
    position = {},
    employment = {},
    isMember,
  } = data;
  const animRef = useAnimation();
  console.log(isMember)
  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data.profile),
      birthDate: dayjs(data.profile.birth_date),
      gender: data.profile.gender != 1 ? 0 : 1,
    });
  }
  useEffect(() => {
    const FIO = getFIO(individual);
    if (!FIO) return;
    setFormData({
      fio: FIO,
      birthDate: individual.birthDate ? dayjs(individual.birthDate) : "",
      gender: individual.gender ?? formData.gender,
      phoneNumber: individual.phone,
      email: individual.email,
      signDate: data.memberJoinDate,
    });
  }, [data]);

  return (
    <div ref={animRef} className="modal-content">
      <FinderPINFL
        pinflValue={individual.pinfl}
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
          value={formData.signDate ? dayjs(formData.signDate) : null}
          name="signDate"
        />
      </div>
      <div className="modal-row">
        <FormInput value={formData.phoneNumber} label={t("phone-number")} name="phoneNumber" />
        <FormInput value={formData.email} label={t("email")} name="email" />
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
        defaultValue={false}
        label={t("isFired")}
        left
        name="isMember"
        value={isMember ?? false}
        onChange={(e) => {
          setMode(e.target.value);
        }}
        data={[
          {
            value: true,
            label: t("yes"),
          },
          {
            value: false,
            label: t("no"),
          },
        ]}
      />
      </div>
    </div>
  );
}
