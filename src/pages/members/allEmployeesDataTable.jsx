import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DataTable from "@/components/DataTable";
import FinderPINFL from "@/components/FinderPINFL";
import FormInput from "@/components/FormInput";
import dayjs from "dayjs";
import styles from "./members.module.scss";
import { useSnackbar } from "notistack";
import { Button } from "@mui/material";
import { getFIO, getLocLabel, getLocalizationNames, splitEmployement, splitFIO } from "@/utils/data";
import { useSelector } from "react-redux";
import { deleteEmployee, sendEmployee } from "@/http/data";
import CheckBoxGroup from "@/components/CheckBoxGroup";
import useActions from "@/hooks/useActions";
import { showYesNoDialog } from "@/utils/dialog";
import { LoadingButton } from "@mui/lab";
import VisibilityIcon from "@mui/icons-material/Visibility";
import useDynamicData from "@/hooks/useDynamicData";
import RadioGroup from "@/components/RadioGroup";
import { generateTicketData } from "@/utils/encryptdecrypt";
import { getUrlWithQuery, openBlankURL } from "@/utils/window";
import QRCode from "react-qr-code";
import SimpleDialog from "@/components/SimpleDialog";
import useAnimation from "@/hooks/useAnimation";
import { convertStringToFormatted } from "@/utils/date";

export default function AllEmployeesDT() {
  const { t, i18n } = useTranslation();
  const [rows, setRows] = useState([]);
  const [qrURL, setQRURL] = useState("");
  const [isZoomQR, setIsZoomQR] = useState(false);
  const { bkutData = {} } = useSelector((states) => states);
  const [positions] = useDynamicData({ positions: true });
  const bkutDataRef = useRef(bkutData);
  const { enqueueSnackbar } = useSnackbar();
  const actions = useActions();

  const columns = [
    { field: "fio", headerName: "employees.fio", size: 280 },
    { field: "signDate", headerName: "join-date" },
    {
      field: "employment",
      type: "chip",
      headerName: "employment",
      default: [
        t("isHomemaker"),
        t("isInvalid"),
        t("isStudent"),
      ].join(", "),
    },
    { field: "pinfl", headerName: "pinfl", hidden: true },
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
    {
      field: "email",
      headerName: "email",
    },
  ];

  function getEmployeement(member) {
    let result = [];
    if (member.isHomemaker) result.push(t("isHomemaker"));
    if (member.isInvalid) result.push(t("isInvalid"));
    if (member.isStudent) result.push(t("isStudent"));

    return result;
  }

  useEffect(() => {
    if (!bkutData?.employees?.length) return;
    setRows(
      bkutData?.employees.map((e) => {
        return {
          id: e?.individual?.id,
          fio: getFIO(e.individual),
          signDate: e.memberJoinDate,
          employment: getEmployeement(e),
          birthDate: convertStringToFormatted(e.individual?.birthDate),
          position: getLocalizationNames(e.position, i18n),
          phoneNumber: e.individual.phone,
          email: e.individual.email,
        };
      })
    );
  }, [bkutData]);
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
  
  async function sendData(forms, hideModal, isView, noAlert) {
    const fio = splitFIO(forms.fio);
    const isMemberValue = forms.isMember === "true";
    const isKasabaActives = forms.isKasabaActive === "true";
    const isFired = forms.isPensioner === "true";
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
      isPensioner: isFired,
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
        if (forms.isMember == 1) await sendData(forms);
        else await deleteEmployee(forms);
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
    <React.Fragment>
      <SimpleDialog open={isZoomQR} onClose={() => setIsZoomQR(false)}>
        <QRCode
          size={400}
          value={qrURL}
          style={{ height: "auto" }}
          viewBox={`0 0 400 400`}
        />
      </SimpleDialog>
      <DataTable
        fetchData={fetchData}
        handleDeleteClick={deleteRow}
        columns={columns}
        rows={rows}
        bkutData={bkutData}
        onImportRow={onImportRow}
        onSubmitModal={onSubmitModal}
        isFormModal
        title={t("bkutEmployee")}
        modalWidth="80vw"
        modal={(hideModal, dataModal) => (
          <ModalUI positions={positions} data={dataModal} hideModal={hideModal} />
        )}
      />
    </React.Fragment>
  );
}

function ModalUI({ hideModal, positions, data = {} }) {
  const { t } = useTranslation();
  const [isMember, setIsMember] =  useState(
    localStorage.getItem('isMember') === 'true' ? 'true' : 'false'
  );
  const [isKasabaActive, setIsKasabaActive] = useState(
    localStorage.getItem('isKasabaActive') === 'true' ? 'true' : 'false'
  );
  const [isPensioner, setIsPensioner] = useState(
    localStorage.getItem('isPensioner') === 'true' ? 'true' : 'false'
  );

  // Save isKasabaActives state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('isKasabaActive', isKasabaActive);
  }, [isKasabaActive]);
  useEffect(() => {
    localStorage.setItem('isMember', isMember);
  }, [isMember]);
  useEffect(() => {
    localStorage.setItem('isPensioner', isPensioner);
  }, [isPensioner]);
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
  } = data;
  console.log(isKasabaActive)
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

  function onFetchPINFL(data) {
    if (!data) return;

    setFormData({
      fio: getFIO(data.profile),
      birthDate: dayjs(data.profile.birth_date),
      gender: data.profile.gender != 1 ? 0 : 1,
    });
  }
  return (
    <div ref={animRef} className="modal-content">
      <FinderPINFL
        disablePINFL
        pinflValue={individual.pinfl}
        onFetch={onFetchPINFL}
      />
      <div className="modal-row">
        <FormInput
          disabled
          required
          label={t("fio")}
          name="fio"
          value={formData.fio}
        />
        <FormInput
          select
          required
          value="1"
          disabled
          name="gender"
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
      </div>
      <div className="modal-row">
        <FormInput value={formData.phoneNumber} label={t("phone-number")} name="phoneNumber" />
        <FormInput value={formData.email} label={t("employees.email")} name="email" />
      </div>
      <div className="modal-row">
       <RadioGroup
        defaultValue={false}
        label={t("isMember")}
        left
        name="isMember"
        value={isMember ?? false}
        onChange={(e) => {
          setIsMember(e.target.value);
        }}
        data={[
          {
            value: 'true',
            label: t("yes"),
          },
          {
            value: 'false',
            label: t("no"),
          },
        ]}
      />
       {isMember === 'true' && (
          <FormInput
            date
            label={t("employees.dateSign")}
            value={formData.signDate ? dayjs(formData.signDate) : null}
            name="signDate"
          />
        )}
      </div>
      <div className="modal-row">
        <RadioGroup
          defaultValue={false}
          label={t("isKasabaActive")}
          left
          name="isKasabaActive"
          value={isKasabaActive ?? false}
          onChange={(e) => {
            setIsKasabaActive(e.target.value);
          }}
          data={[
            {
              value: 'true',
              label: t("yes"),
            },
            {
              value: 'false',
              label: t("no"),
            },
          ]}
        />

        {isKasabaActive === 'true' && (
          <RadioGroup
          defaultValue={false}
          label={t("isFired")}
          left
          name="isPensioner"
          value={isPensioner ?? false}
          onChange={(e) => {
            setIsPensioner(e.target.value);
          }}
          data={[
            {
              value: 'true',
              label: t("yes"),
            },
            {
              value: 'false',
              label: t("no"),
            },
          ]}
        />
        
        )}
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
        </div>
    </div>
  );
}